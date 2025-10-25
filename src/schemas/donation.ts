import { z } from "zod";

export const donationSchema = z.object({
  donationAmount: z
    .number()
    .min(5, "Donation must be at least $5")
    .max(50000, "Donation cannot exceed $50,000"),
  organizationName: z.string().min(1, "Organization name is required"),
  organizationSlug: z.string().min(1, "Organization slug is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
  organizationStripeAccountId: z
    .string()
    .min(1, "Organization Stripe account ID is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectId: z.string().min(1, "Project ID is required"),
  projectDescription: z.string().optional(),
});

export type DonationSchema = z.infer<typeof donationSchema>;
