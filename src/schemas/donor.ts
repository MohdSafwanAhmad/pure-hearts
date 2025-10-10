import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Canada provinces and a simple city list for each (extend as needed) */
/* ------------------------------------------------------------------ */
export const CA_PROVINCES_TO_CITIES: Record<string, string[]> = {
  Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
  "British Columbia": ["Vancouver", "Victoria", "Kelowna", "Surrey", "Burnaby"],
  Manitoba: ["Winnipeg", "Brandon", "Steinbach"],
  "New Brunswick": ["Moncton", "Saint John", "Fredericton"],
  "Newfoundland and Labrador": ["St. John's", "Corner Brook", "Gander"],
  "Nova Scotia": ["Halifax", "Sydney", "Truro"],
  Ontario: [
    "Toronto",
    "Ottawa",
    "Mississauga",
    "Brampton",
    "Hamilton",
    "London",
  ],
  "Prince Edward Island": ["Charlottetown", "Summerside"],
  Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
  Saskatchewan: ["Saskatoon", "Regina", "Prince Albert"],
  "Northwest Territories": ["Yellowknife", "Hay River"],
  Nunavut: ["Iqaluit"],
  Yukon: ["Whitehorse"],
};

export const CANADIAN_PROVINCES = Object.keys(CA_PROVINCES_TO_CITIES);

export const donorSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "Please enter at least 2 characters")
      .max(100, "Please enter at most 100 characters")
      .trim(),
    last_name: z
      .string()
      .min(2, "Please enter at least 2 characters")
      .max(100, "Please enter at most 100 characters")
      .trim(),
    email: z.email("Please enter a valid email address"),
    phone: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !val ||
          val.trim() === "" ||
          /^\+?[\d\s\-\(\)]+$/.test(val.trim()),
        {
          message: "Please enter a valid phone number",
        }
      ),
    address: z
      .string()
      .min(1, "Address is required")
      .max(200, "Address must be less than 200 characters")
      .trim(),
    state: z
      .string()
      .min(1, "State/Province is required")
      .refine((v) => CANADIAN_PROVINCES.includes(v), {
        message: "Please select a valid province",
      }),
    city: z.string().min(1, "City is required"),
    country: z.literal("Canada"),
    donation_preferences: z
      .array(z.string())
      .min(1, "Please select at least one donation preference"),
  })
  .superRefine((val, ctx) => {
    // Ensure city belongs to chosen province
    if (val.state) {
      const allowed = CA_PROVINCES_TO_CITIES[val.state] ?? [];
      if (allowed.length && !allowed.includes(val.city)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["city"],
          message: `Please select a valid city in ${val.state}`,
        });
      }
    }
  });

export const loginDonorSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type TDonorSchema = z.infer<typeof donorSchema>;
export type TLoginDonorSchema = z.infer<typeof loginDonorSchema>;