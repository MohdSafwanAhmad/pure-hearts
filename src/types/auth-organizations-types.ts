export interface OrganizationFormData {
  // Basic Information
  organizationName: string;
  organizationEmail: string;
  organizationPhone: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;

  // Location
  country: string;
  state: string;
  city: string;
  address: string;

  // Mission & Projects
  missionStatement: string;
  projectAreas: string[];
  websiteUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
}

export interface FormErrors {
  organizationName?: string[];
  organizationEmail?: string[];
  organizationPhone?: string[];
  contactPersonName?: string[];
  contactPersonEmail?: string[];
  contactPersonPhone?: string[];
  country?: string[];
  state?: string[];
  city?: string[];
  address?: string[];
  missionStatement?: string[];
  projectAreas?: string[];
  websiteUrl?: string[];
  facebookUrl?: string[];
  twitterUrl?: string[];
  instagramUrl?: string[];
  linkedinUrl?: string[];
  _form?: string[];
}

export interface SectionProps {
  formData: OrganizationFormData;
  errors: FormErrors;
  onUpdateFormData: (updates: Partial<OrganizationFormData>) => void;
}

export const canadianProvinces = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
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
