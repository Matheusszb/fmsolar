begin;
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade, role text not null check(role='admin'));
alter table public.profiles enable row level security;
create function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon,authenticated;
create policy profile_self on public.profiles for select to authenticated using(id=(select auth.uid()));
create table public.projects(
 id uuid primary key default gen_random_uuid(),title text not null check(length(title) between 3 and 180),slug text unique not null check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 summary text not null default '',description text not null default '',category text not null default 'residential' check(category in ('residential','commercial','industrial','rural')),
 city text not null default '',state text not null default '' check(state='' or state in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO')),
 power_kwp numeric check(power_kwp>=0),modules_count integer check(modules_count>=0),module_model text default '',module_power_w numeric check(module_power_w>=0),inverters_count integer check(inverters_count>=0),inverter_model text default '',
 estimated_monthly_generation numeric check(estimated_monthly_generation>=0),estimated_monthly_savings numeric check(estimated_monthly_savings>=0),estimated_annual_savings numeric check(estimated_annual_savings>=0),estimated_reduction_percentage numeric check(estimated_reduction_percentage between 0 and 100),
 challenge text default '',solution text default '',results text default '',completion_date date,status text not null default 'draft' check(status in ('draft','published')),featured boolean not null default false,
 cover_image uuid,before_image uuid,after_image uuid,created_by uuid references auth.users(id) default auth.uid(),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),published_at timestamptz,
 check(status='draft' or (length(summary)>0 and length(city)>0 and length(state)=2))
);
create table public.project_images(id uuid primary key default gen_random_uuid(),project_id uuid not null references public.projects(id) on delete cascade,storage_path text unique not null,alt_text text not null default '',caption text not null default '',sort_order integer not null default 0,created_at timestamptz not null default now(),unique(project_id,id),check(storage_path like project_id::text||'/%'));
-- A single cover reference is the source of truth; composite keys prevent cross-project references.
alter table public.projects add constraint project_cover foreign key(id,cover_image) references public.project_images(project_id,id) deferrable initially deferred;
alter table public.projects add constraint project_before foreign key(id,before_image) references public.project_images(project_id,id) deferrable initially deferred;
alter table public.projects add constraint project_after foreign key(id,after_image) references public.project_images(project_id,id) deferrable initially deferred;
create index projects_public on public.projects(status,published_at desc);
create index projects_filters on public.projects(category,state);
create index projects_featured on public.projects(featured) where status='published';
create index images_project_order on public.project_images(project_id,sort_order);
create function public.touch_project() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();if new.status='published' and (tg_op='INSERT' or old.status='draft') then new.published_at=now();end if;return new;end; $$;
create trigger touch_project before insert or update on public.projects for each row execute function public.touch_project();
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
create policy projects_read on public.projects for select to anon,authenticated using(status='published' or (select public.is_admin()));
create policy projects_admin on public.projects for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
create policy images_read on public.project_images for select to anon,authenticated using(exists(select 1 from public.projects p where p.id=project_id and (p.status='published' or (select public.is_admin()))));
create policy images_admin on public.project_images for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
grant select on public.projects,public.project_images to anon;
grant select,insert,update,delete on public.projects,public.project_images to authenticated;
grant select on public.profiles to authenticated;
revoke insert,update,delete on public.profiles from anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('obras','obras',false,10485760,array['image/jpeg','image/png','image/webp']);
create policy obras_read on storage.objects for select to anon,authenticated using(bucket_id='obras' and ((select public.is_admin()) or exists(select 1 from public.project_images i join public.projects p on p.id=i.project_id where i.storage_path=name and p.status='published')));
create policy obras_insert on storage.objects for insert to authenticated with check(bucket_id='obras' and (select public.is_admin()) and exists(select 1 from public.projects where id::text=(storage.foldername(name))[1]));
create policy obras_update on storage.objects for update to authenticated using(bucket_id='obras' and (select public.is_admin())) with check(bucket_id='obras' and (select public.is_admin()));
create policy obras_delete on storage.objects for delete to authenticated using(bucket_id='obras' and (select public.is_admin()));
commit;
