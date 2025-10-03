import fs from "node:fs";
import path from "node:path";
// Standalone build: embeds AFM data so no disk reads for Helvetica
// @ts-expect-error: pdfkit standalone build does not have type definitions
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { Donation, DonationReceiptData } from "@/src/types/donation-types";

function safeIsoDate(v: string | null | undefined): string {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function findInterFont(): string | null {
  const tries = [
    ["public", "fonts", "Inter", "static", "Inter-Regular.ttf"],
    ["public", "fonts", "Inter", "Inter-VariableFont_opsz,wght.ttf"],
    ["public", "fonts", "Inter", "Inter-Italic-VariableFont_opsz,wght.ttf"],
    ["public", "fonts", "Inter-Regular.ttf"],
  ];
  for (const parts of tries) {
    const p = path.join(process.cwd(), ...parts);
    if (fs.existsSync(p)) return p;
  }
  return null;
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

  // ✅ No disk reads, no Inter, just use built-in Helvetica
  doc.font("Helvetica"); // or "Times-Roman", "Courier"
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
