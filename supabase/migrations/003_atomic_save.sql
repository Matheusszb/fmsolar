-- Persist details, image ordering and publication together.
create function public.save_complete_project(p_id uuid,p_data jsonb,p_images jsonb,p_cover uuid,p_before uuid,p_after uuid) returns uuid language plpgsql security invoker set search_path='' as $$
declare record public.projects;
begin
 if not public.is_admin() then raise exception 'Acesso negado';end if;
 select * into record from jsonb_populate_record(null::public.projects,p_data);
 update public.projects set title=record.title,
 slug=record.slug,
 summary=record.summary,
 description=record.description,
 category=record.category,
 city=record.city,
 state=record.state,
 power_kwp=record.power_kwp,
 modules_count=record.modules_count,
 module_model=record.module_model,
 module_power_w=record.module_power_w,
 inverters_count=record.inverters_count,
 inverter_model=record.inverter_model,
 estimated_monthly_generation=record.estimated_monthly_generation,
 estimated_monthly_savings=record.estimated_monthly_savings,
 estimated_annual_savings=record.estimated_annual_savings,
 estimated_reduction_percentage=record.estimated_reduction_percentage,
 challenge=record.challenge,
 solution=record.solution,
 results=record.results,
 completion_date=record.completion_date,
 status=record.status,
 featured=record.featured where id=p_id;
 if not found then raise exception 'Obra não encontrada';end if;
 perform public.save_project_images(p_id,p_images,p_cover,p_before,p_after);
 return p_id;
end;$$;
revoke all on function public.save_complete_project(uuid,jsonb,jsonb,uuid,uuid,uuid) from public;
grant execute on function public.save_complete_project(uuid,jsonb,jsonb,uuid,uuid,uuid) to authenticated;
