import { z } from "zod";

export const planFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  monthly_fee: z.number().gte(0, "Monthly fee cannot be negative"),
  feature_ids: z.array(z.number()).optional(),
});

export type PlanFormSchemaType = z.infer<typeof planFormSchema>;

export const subscriptionUpdateSchema = z.object({
  plan_id: z.number(),
  billing_day: z.number().gte(1, "Billing day must be 1-28").lte(28, "Billing day must be 1-28").optional(),
});

export type SubscriptionUpdateSchemaType = z.infer<typeof subscriptionUpdateSchema>;
