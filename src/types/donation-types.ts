import { Tables } from "./database-types";

export type Donation = Tables<"donations">;
export type Donor = Tables<"donors">;
export type Project = Tables<"projects">;
export type Organization = Tables<"organizations">;

export interface DonationWithRelations extends Donation {
  donors?: Donor | null;
  projects?: ProjectWithOrganization | null;
}

export interface ProjectWithOrganization extends Project {
  organizations?: Organization | null;
}

export interface DonationReceiptData {
  id: string;
  amount: number;
  created_at: string;
  donorName: string;
  donorEmail: string;
  organizationName: string;
  projectTitle: string;
}

export interface DonationSummary {
  totalAmount: number;
  totalDonations: number;
  thisMonthAmount: number;
  thisYearAmount: number;
}

export interface DonationHistory {
  donations: DonationWithRelations[];
  summary: DonationSummary;
}