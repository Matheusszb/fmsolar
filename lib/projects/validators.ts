import { z } from 'zod';
import { states } from './types';
const text = (max = 10000) => z.string().trim().max(max);
const positive = z.number().finite().min(0).max(1e9).nullable();
export const projectSchema = z
  .object({
    title: text(180).min(3, 'O título deve ter pelo menos 3 caracteres.'),
    slug: text(160).regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Use um slug com letras minúsculas, números e hífens.',
    ),
    summary: text(500),
    description: text(30000),
    category: z.enum(['residential', 'commercial', 'industrial', 'rural']),
    city: text(120),
    state: z.union([z.enum(states), z.literal('')]),
    power_kwp: positive,
    modules_count: positive.refine(
      (v) => v === null || Number.isInteger(v),
      'Informe um número inteiro.',
    ),
    module_model: text(200),
    module_power_w: positive,
    inverters_count: positive.refine(
      (v) => v === null || Number.isInteger(v),
      'Informe um número inteiro.',
    ),
    inverter_model: text(200),
    estimated_monthly_generation: positive,
    estimated_monthly_savings: positive,
    estimated_annual_savings: positive,
    estimated_reduction_percentage: z.number().min(0).max(100).nullable(),
    challenge: text(),
    solution: text(),
    results: text(),
    completion_date: z.string().date().nullable(),
    status: z.enum(['draft', 'published']),
    featured: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'published' && (!data.city || !data.state || !data.summary))
      ctx.addIssue({
        code: 'custom',
        message: 'Preencha resumo, cidade e estado antes de publicar.',
      });
  });
export type ProjectInput = z.infer<typeof projectSchema>;
