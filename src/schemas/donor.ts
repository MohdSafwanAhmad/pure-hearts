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

export type TCreateDonor = z.infer<typeof createDonorSchema>;
