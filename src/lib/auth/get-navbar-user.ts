// src/lib/auth/get-navbar-user.ts

import { getDonorProfile, getOrganizationProfile } from "../supabase/server";

/**
 * A single server helper used by Navbar
 */


export type NavbarUser =
  | { type: "donor"; profileHref: string }
  | { type: "organization"; profileHref: string };

export async function getNavbarUser(): Promise<NavbarUser | null> {
  const [donor, organization] = await Promise.all([
    getDonorProfile(),
    getOrganizationProfile(),
  ]);

  if (organization) {
    return {
      type: "organization",
      profileHref: `/organizations/${organization.slug}`,
    };
  }

  if (donor) {
    return {
      type: "donor",
      profileHref: `/dashboard/donor/profile`,
    };
  }

  return null;
}
