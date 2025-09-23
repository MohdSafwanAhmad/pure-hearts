import fs from "node:fs";
import path from "node:path";
// Standalone build: embeds AFM data so no disk reads for Helvetica
// @ts-ignore
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

function safeIsoDate(v: string | null | undefined) {
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

// Next 15: params is a Promise
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ donationId: string }> }
) {
  try {
    const { donationId } = await ctx.params;

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) return new Response(userErr.message, { status: 500 });
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { data, error } = await supabase
      .from("donations")
      .select(`
        id,
        amount,
        created_at,
        donors:donor_id ( first_name, last_name ),
        projects:project_id (
          title,
          organizations:organization_user_id ( organization_name )
        )
      `)
      .eq("id", donationId)
      .eq("donor_id", user.id)
      .maybeSingle();

    if (error) return new Response(error.message, { status: 500 });
    if (!data) return new Response("Not found", { status: 404 });

    const donorName =
      [data.donors?.first_name, data.donors?.last_name].filter(Boolean).join(" ") ||
      user.email ||
      "—";
    const organization = data.projects?.organizations?.organization_name ?? "—";
    const project = data.projects?.title ?? "—";
    const amount = Number(data.amount ?? 0);
    const dateIso = safeIsoDate(data.created_at);

    // ---- PDF ----
    const doc = new PDFDocument({ margin: 50, autoFirstPage: false });

    // stream buffers
    const chunks: Buffer[] = [];
    doc.on("data", (b: Buffer) => chunks.push(b));
    const done = new Promise<Buffer>((resolve) =>
      doc.on("end", () => resolve(Buffer.concat(chunks)))
    );

    // Load Inter as BUFFER (do NOT pass a path to doc.font)
    const interPath = findInterFont();
    if (!interPath) {
      console.error("Inter font not found under /public/fonts/Inter");
      return new Response(
        "Font not found. Place Inter .ttf under /public/fonts/Inter (e.g. /static/Inter-Regular.ttf).",
        { status: 500 }
      );
    }
    const fontBuf = await fs.promises.readFile(interPath);
    doc.registerFont("Body", fontBuf);
    doc.font("Body");   // <- activate it BEFORE first page
    doc.addPage();

    // Content
    doc.fontSize(20).text("Donation Receipt", { align: "center" }).moveDown();
    doc.fontSize(12);
    doc.text(`Receipt #      : ${data.id}`);
    doc.text(`Date           : ${dateIso}`);
    doc.text(`Donor          : ${donorName}`);
    doc.text(`Email          : ${user.email ?? "—"}`);
    doc.text(`Organization   : ${organization}`);
    doc.text(`Project        : ${project}`);
    doc.text(`Amount Donated : $${amount.toFixed(2)}`);
    doc.moveDown().text("Thank you for your generous contribution.");
    doc.end();

    const pdf = await done;
    const bytes = new Uint8Array(pdf.length);
    bytes.set(pdf);

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt_${donationId}.pdf"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (e: any) {
    console.error("Receipt route error:", e);
    return new Response(e?.message ?? "Internal Server Error", { status: 500 });
  }
}
