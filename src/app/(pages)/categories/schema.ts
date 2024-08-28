import { z } from 'zod';

export const validationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
});

export type FormDataTypes = z.infer<typeof validationSchema>;
