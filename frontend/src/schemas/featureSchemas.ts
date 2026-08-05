import { z } from "zod";

export const featureFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  code: z.string().min(2, "Code must be at least 2 characters").max(100),
  unit_price: z.number().gt(0, "Unit price must be greater than 0"),
  max_unit_limit: z.number().gt(0, "Max limit must be greater than 0"),
  is_active: z.boolean(),
});

export type FeatureFormSchemaType = z.infer<typeof featureFormSchema>;
