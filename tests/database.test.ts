import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
describe('migrations e autorização PostgreSQL', () => {
  it('protege rascunhos, escrita, papéis e capa por projeto', async () => {
    const db = new PGlite();
    try {
      await db.exec(
        `create role anon;create role authenticated;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;grant usage on schema public,auth,storage to anon,authenticated;grant select,insert,update,delete on storage.objects to anon,authenticated;`,
      );
      for (const file of ['001_initial.sql', '002_admin_functions.sql', '003_atomic_save.sql'])
        await db.exec(readFileSync(`supabase/migrations/${file}`, 'utf8'));
      const admin = '00000000-0000-4000-8000-000000000001';
      const outsider = '00000000-0000-4000-8000-000000000002';
      const project = '00000000-0000-4000-8000-000000000003';
      const other = '00000000-0000-4000-8000-000000000004';
      const image = '00000000-0000-4000-8000-000000000005';
      await db.exec(
        `insert into auth.users values('${admin}'),('${outsider}');insert into public.profiles values('${admin}','admin');set role authenticated;set request.jwt.claim.sub='${admin}';insert into public.projects(id,title,slug) values('${project}','Projeto teste','projeto-teste'),('${other}','Outro projeto','outro-projeto');insert into public.project_images(id,project_id,storage_path) values('${image}','${project}','${project}/foto.webp');insert into storage.objects(bucket_id,name) values('obras','${project}/foto.webp');select public.save_project_images('${project}','[]','${image}',null,null);`,
      );
      await expect(
        db.exec(`select public.save_project_images('${other}','[]','${image}',null,null)`),
      ).rejects.toThrow();
      await db.query(
        'select public.save_complete_project($1,(select to_jsonb(p) from public.projects p where id=$1),$2,$3,null,null)',
        [project, '[]', image],
      );
      await db.exec(`set role anon;set request.jwt.claim.sub='';`);
      expect((await db.query('select * from public.projects')).rows).toHaveLength(0);
      expect((await db.query('select * from public.project_images')).rows).toHaveLength(0);
      expect((await db.query('select * from storage.objects')).rows).toHaveLength(0);
      await expect(
        db.exec("insert into public.projects(title,slug) values('Invasão','invasao')"),
      ).rejects.toThrow();
      await db.exec(`set role authenticated;set request.jwt.claim.sub='${outsider}';`);
      await expect(
        db.exec(`insert into public.profiles values('${outsider}','admin')`),
      ).rejects.toThrow();
      await expect(db.exec(`select public.dashboard_stats()`)).rejects.toThrow();
      await db.exec(
        `set request.jwt.claim.sub='${admin}';update public.projects set status='published',summary='Resumo do projeto',city='Palmas',state='TO' where id='${project}';set role anon;set request.jwt.claim.sub='';`,
      );
      expect((await db.query('select * from public.projects')).rows).toHaveLength(1);
      expect((await db.query('select * from storage.objects')).rows).toHaveLength(1);
      await db.exec(
        `set role authenticated;set request.jwt.claim.sub='${admin}';update public.projects set status='draft' where id='${project}';set role anon;set request.jwt.claim.sub='';`,
      );
      expect((await db.query('select * from storage.objects')).rows).toHaveLength(0);
      await db.exec(
        `set role authenticated;set request.jwt.claim.sub='${admin}';select public.remove_project_image('${image}');delete from public.projects where id='${project}';`,
      );
      expect((await db.query('select * from public.project_images')).rows).toHaveLength(0);
    } finally {
      await db.close();
    }
  }, 30000);
});
