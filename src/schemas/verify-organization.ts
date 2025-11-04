import { z } from "zod";

export const verifyOrganizationSchema = z.object({
  reviewerFirstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  reviewerLastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  reviewerPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+\d+$/,
      "Please enter a valid phone number in format +15554443333"
    ),
  adminNotes: z.string().optional(),
});

export const rejectOrganizationSchema = verifyOrganizationSchema.extend({
  adminNotes: z
    .string()
    .min(10, "Rejection notes must be at least 10 characters")
    .max(500, "Rejection notes must be less than 500 characters"),
});

export type TVerifyOrganizationSchema = z.infer<typeof verifyOrganizationSchema>;
export type TRejectOrganizationSchema = z.infer<typeof rejectOrganizationSchema>;
