// server-only APIs (Node runtime)
import "server-only";

// Standalone build: embeds AFM data so no disk reads for Helvetica
// @ts-expect-error: pdfkit standalone build does not have type definitions
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Donation, DonationReceiptData } from "@/src/types/donation-types";

/* ----------------------------------------------------------------------------
   Donor profile (from donor-profile.ts, unchanged in behavior)
---------------------------------------------------------------------------- */

export type DonorProfile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null; // keep if you created this column
  country: string | null;
  profile_completed: boolean | null;
};

export async function getMyDonorProfile(
  userId: string
): Promise<DonorProfile | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("donors")
    // if your DB is still missing some of these, we’ll fall back below
    .select(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "user_id, first_name, last_name, phone, address, city, state, country, profile_completed" as any
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error && /does not exist/.test(error.message)) {
    // Fallback while columns are still being added
    const { data: basic, error: e2 } = await supabase
      .from("donors")
      .select("user_id, first_name, last_name, profile_completed")
      .eq("user_id", userId)
      .maybeSingle();

    if (e2) throw new Error(e2.message);
    if (!basic) return null;

    return {
      user_id: basic.user_id,
      first_name: basic.first_name ?? null,
      last_name: basic.last_name ?? null,
      phone: null,
      address: null,
      city: null,
      state: null,
      country: null,
      profile_completed: basic.profile_completed ?? false,
    };
  }

  if (error) throw new Error(error.message);
  return data as unknown as DonorProfile;
}

/* ----------------------------------------------------------------------------
   Donations (from donations.ts, unchanged in behavior)
---------------------------------------------------------------------------- */

function safeIsoDate(v: string | null | undefined): string {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export async function getDonationReceiptData(
  donationId: string,
  userId: string
): Promise<DonationReceiptData | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("donations")
    .select(
      `
      id,
      amount,
      created_at,
      donors:donor_id ( first_name, last_name ),
      projects:project_id (
        title,
        organizations:organization_user_id ( organization_name )
      )
    `
    )
    .eq("id", donationId)
    .eq("donor_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching donation:", error);
    return null;
  }

  if (!data) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const donorName =
    [data.donors?.first_name, data.donors?.last_name]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "—";

  return {
    id: data.id,
    amount: Number(data.amount ?? 0),
    created_at: data.created_at ?? "",
    donorName,
    donorEmail: user?.email ?? "—",
    organizationName: data.projects?.organizations?.organization_name ?? "—",
    projectTitle: data.projects?.title ?? "—",
  };
}

export async function generateReceiptPdf(
  receiptData: DonationReceiptData
): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50, autoFirstPage: false });

  // Stream -> Buffer
  const chunks: Buffer[] = [];
  doc.on("data", (b: Buffer) => chunks.push(b));
  const done = new Promise<Buffer>((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  );

  // ✅ No disk reads; use built-in Helvetica
  doc.font("Helvetica");
  doc.addPage();

  const dateIso = safeIsoDate(receiptData.created_at);

  doc.fontSize(20).text("Donation Receipt", { align: "center" }).moveDown();
  doc.fontSize(12);
  doc.text(`Receipt #      : ${receiptData.id}`);
  doc.text(`Date           : ${dateIso}`);
  doc.text(`Donor          : ${receiptData.donorName}`);
  doc.text(`Email          : ${receiptData.donorEmail}`);
  doc.text(`Organization   : ${receiptData.organizationName}`);
  doc.text(`Project        : ${receiptData.projectTitle}`);
  doc.text(`Amount Donated : $${receiptData.amount.toFixed(2)}`);
  doc.moveDown().text("Thank you for your generous contribution.");
  doc.end();

  return await done;
}

export async function getDonationsByUserId(
  userId: string
): Promise<Donation[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("donor_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user donations:", error);
    return [];
  }

  return data || [];
}
