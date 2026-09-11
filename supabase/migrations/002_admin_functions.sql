create function public.dashboard_stats() returns jsonb language plpgsql stable security invoker set search_path='' as $$ begin if not public.is_admin() then raise exception 'Acesso negado';end if;return (select jsonb_build_object('total',count(*),'published',count(*) filter(where status='published'),'draft',count(*) filter(where status='draft'),'featured',count(*) filter(where featured),'photos',(select count(*) from public.project_images),'power',coalesce(sum(power_kwp),0)) from public.projects);end;$$;
revoke all on function public.dashboard_stats() from public;
grant execute on function public.dashboard_stats() to authenticated;

create function public.save_project_images(p_id uuid,p_images jsonb,p_cover uuid,p_before uuid,p_after uuid) returns void language plpgsql security invoker set search_path='' as $$
declare item jsonb;
begin
 if not public.is_admin() then raise exception 'Acesso negado';end if;
 perform 1 from public.projects where id=p_id for update;
 for item in select * from jsonb_array_elements(p_images) loop
  update public.project_images set alt_text=left(item->>'alt_text',500),caption=left(item->>'caption',1000),sort_order=(item->>'sort_order')::integer where id=(item->>'id')::uuid and project_id=p_id;
 end loop;
 update public.projects set cover_image=p_cover,before_image=p_before,after_image=p_after where id=p_id;
end;$$;
revoke all on function public.save_project_images(uuid,jsonb,uuid,uuid,uuid) from public;
grant execute on function public.save_project_images(uuid,jsonb,uuid,uuid,uuid) to authenticated;

create function public.remove_project_image(image_id uuid) returns void language plpgsql security invoker set search_path='' as $$ begin
 if not public.is_admin() then raise exception 'Acesso negado';end if;
 update public.projects set cover_image=case when cover_image=image_id then null else cover_image end,before_image=case when before_image=image_id then null else before_image end,after_image=case when after_image=image_id then null else after_image end where cover_image=image_id or before_image=image_id or after_image=image_id;
 delete from public.project_images where id=image_id;
end;$$;
revoke all on function public.remove_project_image(uuid) from public;
grant execute on function public.remove_project_image(uuid) to authenticated;
