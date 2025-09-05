import "./globals.css"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Pure Hearts",
  description: "Tech-driven Zakat and Donation Platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />   {/* ✅ Navbar will appear on all pages */}
        <main>{children}</main>
      </body>
    </html>
  )
}
