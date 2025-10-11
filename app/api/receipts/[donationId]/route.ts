import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { getDonationReceiptData, generateReceiptPdf } from "@/src/api/donations";

export const runtime = "nodejs";

// Next 15: params is a Promise
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ donationId: string }> }
) {
  try {
    const { donationId } = await ctx.params;

    // Authenticate user
    const supabase = await createAnonymousServerSupabaseClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    
    if (userErr) return new Response(userErr.message, { status: 500 });
    if (!user) return new Response("Unauthorized", { status: 401 });

    // Get receipt data
    const receiptData = await getDonationReceiptData(donationId, user.id);
    if (!receiptData) {
      return new Response("Donation not found", { status: 404 });
    }

    // Generate PDF
    const pdf = await generateReceiptPdf(receiptData);
    const bytes = new Uint8Array(pdf.length);
    bytes.set(pdf);

    // Generate filename
    const dateForFilename = new Date(receiptData.created_at)
      .toISOString()
      .split("T")[0]; // YYYY-MM-DD format
    const filename = `pure_hearts_donation_receipt_${dateForFilename}`;

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Receipt route error:", error);
    return new Response(error?.message ?? "Internal Server Error", { status: 500 });
  }
}