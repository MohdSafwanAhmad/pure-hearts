import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.email("Please enter a valid email address"),
  token: z
    .string()
    .min(6, "The code must be 6 characters")
    .max(6, "The code must be 6 characters"),
});
export type TVerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
