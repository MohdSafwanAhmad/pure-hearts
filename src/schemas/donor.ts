import { z } from "zod";

export const createDonorSchema = z.object({
  first_name: z
    .string()
    .min(2, "Please enter at least 2 characters")
    .max(100, "Please enter at most 100 characters"),
  last_name: z
    .string()
    .min(2, "Please enter at least 2 characters")
    .max(100, "Please enter at most 100 characters"),
  email: z.email(),
  donation_preferences: z
    .array(z.string())
    .min(1, "Please select at least one donation preference"),
});

export const loginDonorSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type TCreateDonorSchema = z.infer<typeof createDonorSchema>;
export type TLoginDonorSchema = z.infer<typeof loginDonorSchema>;
