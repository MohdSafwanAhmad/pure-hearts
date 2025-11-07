import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-12 text-center lg:text-left">
            <div className="space-y-4 lg:pl-26">
              <h3 className="text-lg font-bold">Pages</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="/about" className="hover:opacity-100">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns" className="hover:opacity-100">
                    Campaigns
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="hover:opacity-100">
                    Quick Donation
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:opacity-100">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y- flex flex-col items-center">
              <div className="flex items-center gap-">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Pure Hearts</span>
              </div>
              <p className="opacity-90 text-pretty max-w-md text-center">
                A tech-driven donation platform delivering Zakat and charity
                with zero admin fees and full transparency.
              </p>
            </div>

            <div className="space-y-4 lg:pl-26">
              <h3 className="text-lg font-bold">Contact</h3>
              <ul className="space-y-2 opacity-90">
                <li>Montreal, Canada</li>
                <li>+1 (555) 123-4567</li>
                <li>pure.heart.platform@gmail.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-10 pt-6">
            <div className="flex flex-col items-center justify-between gap-3 text-sm opacity-90 md:flex-row">
              <p className="text-center md:text-left">
                &copy; 2025 Pure Hearts. All rights reserved.
              </p>
              <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-5">
                <Link href="/privacy-policy" className="hover:opacity-100">
                  Privacy Policy
                </Link>
                <span className="hidden md:inline opacity-50">•</span>
                <Link
                  href="/terms-and-conditions"
                  className="hover:opacity-100"
                >
                  Terms &amp; Conditions
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
