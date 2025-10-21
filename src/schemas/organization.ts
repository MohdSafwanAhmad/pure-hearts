import { z } from "zod";

export const createOrganizationSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters long")
    .max(100, "Organization name must be less than 100 characters"),
  organizationEmail: z.email(
    "Please enter a valid email address for the organization"
  ),
  organizationPhone: z
    .string()
    .min(1, "Organization phone number is required")
    .regex(
      /^\+\d+$/,
      "Please enter a valid phone number in format +15554443333"
    ),
  country: z.string().min(1, "Country selection is required"),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters long")
    .max(50, "City name must be less than 50 characters"),
  address: z
    .string()
    .min(5, "Please provide your complete street address")
    .max(200, "Address must be less than 200 characters"),
  state: z.string().min(1, "Please select your province or territory"),
  contactPersonName: z
    .string()
    .min(2, "Contact person's name must be at least 2 characters long")
    .max(100, "Contact person's name must be less than 100 characters"),
  contactPersonEmail: z.email(
    "Please enter a valid email address for the contact person"
  ),
  contactPersonPhone: z
    .string()
    .min(1, "Contact phone number is required")
    .regex(
      /^\+\d+$/,
      "Please enter a valid phone number in format +15554443333"
    ),
  missionStatement: z
    .string()
    .min(10, "Please provide a mission statement with at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),
  projectAreas: z
    .array(z.number())
    .min(1, "Please select at least one area your organization works in"),
  websiteUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid website URL (must start with http:// or https://)",
    }),
  facebookUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Facebook URL (must start with http:// or https://)",
    }),
  twitterUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Twitter URL (must start with http:// or https://)",
    }),
  instagramUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Instagram URL (must start with http:// or https://)",
    }),
  linkedinUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid LinkedIn URL (must start with http:// or https://)",
    }),
});

export const updateOrganizationSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters long")
    .max(100, "Organization name must be less than 100 characters"),
  organizationPhone: z
    .string()
    .min(1, "Organization phone number is required")
    .regex(
      /^\+\d+$/,
      "Please enter a valid phone number in format +15554443333"
    ),
  country: z.string().min(1, "Country selection is required"),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters long")
    .max(50, "City name must be less than 50 characters"),
  address: z
    .string()
    .min(5, "Please provide your complete street address")
    .max(200, "Address must be less than 200 characters"),
  state: z.string().min(1, "Please select your province or territory"),
  contactPersonName: z
    .string()
    .min(2, "Contact person's name must be at least 2 characters long")
    .max(100, "Contact person's name must be less than 100 characters"),
  contactPersonEmail: z.email(
    "Please enter a valid email address for the contact person"
  ),
  contactPersonPhone: z
    .string()
    .min(1, "Contact phone number is required")
    .regex(
      /^\+\d+$/,
      "Please enter a valid phone number in format +15554443333"
    ),
  missionStatement: z
    .string()
    .min(10, "Please provide a mission statement with at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),
  projectAreas: z
    .array(z.number())
    .min(1, "Please select at least one area your organization works in"),
  websiteUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid website URL (must start with http:// or https://)",
    }),
  facebookUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Facebook URL (must start with http:// or https://)",
    }),
  twitterUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Twitter URL (must start with http:// or https://)",
    }),
  instagramUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Instagram URL (must start with http:// or https://)",
    }),
  linkedinUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid LinkedIn URL (must start with http:// or https://)",
    }),
});

export const loginOrganizationSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type TCreateOrganizationSchema = z.infer<
  typeof createOrganizationSchema
>;

export type TUpdateOrganizationSchema = z.infer<
  typeof updateOrganizationSchema
>;

export type TLoginOrganizationSchema = z.infer<typeof loginOrganizationSchema>;
export { updateOrganizationSchema as organizationSchema };
