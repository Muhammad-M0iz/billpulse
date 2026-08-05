import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "buyer"]),
  password: z.string().min(5, "Password must be at least 5 characters"),
  profile_img: z.string().optional().nullable(),
  profile_file: z.any().optional(),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
