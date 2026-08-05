import { z } from "zod";

export const usageFormSchema = z.object({
  subscription_id: z.number(),
  feature_id: z.number(),
  units_used: z.number().gt(0, "Units used must be greater than 0"),
});

export type UsageFormSchemaType = z.infer<typeof usageFormSchema>;
