import { Database } from "@/src/types/database-types";

export const canadianProvinces = [
  { value: "Alberta", label: "Alberta" },
  { value: "British Columbia", label: "British Columbia" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "New Brunswick", label: "New Brunswick" },
  { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
  { value: "Nova Scotia", label: "Nova Scotia" },
  { value: "Ontario", label: "Ontario" },
  { value: "Prince Edward Island", label: "Prince Edward Island" },
  { value: "Quebec", label: "Quebec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
  { value: "Northwest Territories", label: "Northwest Territories" },
  { value: "Nunavut", label: "Nunavut" },
  { value: "Yukon", label: "Yukon" },
];

export const projectAreaOptions = [
  "Zakat Distribution",
  "Orphan Care (Yateem)",
  "Education & Islamic Learning",
  "Healthcare & Medical Aid",
  "Emergency Relief & Disaster Aid",
  "Poverty Alleviation (Fuqara)",
  "Clean Water & Sanitation",
  "Masjid & Islamic Center Support",
  "Widow Support (Aramil)",
  "Elderly Care",
  "Food Distribution & Feeding Programs",
  "Islamic Scholarship & Da'wah",
  "Community Development",
  "Environmental Conservation (Tawheed)",
];

export type TOrganization =
  Database["public"]["Tables"]["organizations"]["Row"];

export type TDonor = Database["public"]["Tables"]["donors"]["Row"];
