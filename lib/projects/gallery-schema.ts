import { z } from 'zod';
export const gallerySchema = z.object({
  images: z
    .array(
      z.object({
        id: z.string().uuid(),
        alt_text: z.string().max(500),
        caption: z.string().max(1000),
        sort_order: z.number().int().min(0),
      }),
    )
    .max(100),
  cover: z.string().uuid().nullable(),
  before: z.string().uuid().nullable(),
  after: z.string().uuid().nullable(),
});
