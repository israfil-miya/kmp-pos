import { z } from 'zod';

export const validationSchema = z.object({
  name: z.string().min(5, 'Name is required'),
});

export type FormDataTypes = z.infer<typeof validationSchema>;
