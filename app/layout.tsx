import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/src/components/global/navbar";
import Footer from "@/src/components/global/footer";
import { Toaster } from "@/src/components/ui/sonner";

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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}