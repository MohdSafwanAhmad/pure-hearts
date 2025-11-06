import { z } from "zod";

/**
 * Zod schema to validate the payload for creating a new project.  Titles and
 * descriptions are required strings with sensible length constraints.  The
 * goal amount is optional but, if provided, must be a number or a string
 * containing a valid number.  Beneficiary type selection is mandatory
 * because projects must be associated with one of the defined beneficiary
 * categories.  Start and end dates are optional ISO date strings.
 */
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(2, "Project title must be at least 2 characters long")
    .max(100, "Project title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Please provide a description with at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  goalAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Goal amount must be a valid number",
    }),
  beneficiaryType: z
    .string()
    .min(1, "Please select a beneficiary type"),
  startDate: z
    .string()
    .optional(),
  endDate: z
    .string()
    .optional(),
})
  // Cross-field validation: ensure end date is not before start date
  .refine(
    ({ startDate, endDate }) => {
      if (!startDate || !endDate) return true;
      return new Date(endDate) >= new Date(startDate);
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );

export type TCreateProjectSchema = z.infer<typeof createProjectSchema>;