import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pure Hearts",
  description: "Tech-driven Zakat and Donation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* ✅ Navbar will appear on all pages */}
        <main>{children}</main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
