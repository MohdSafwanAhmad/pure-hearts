//src/components/global/navbar/index.tsx

/**
 * Server-side component.
 * What changed:
 * Navbar is now async server
 * No Sign In / Quick Donation here
 * No auth logic duplicated
 * Campaigns link is first-class
 */

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import DesktopNav from "@/src/components/global/navbar/desktop-nav";
import MobileMenu from "@/src/components/global/navbar/mobile-menu";
import { getNavbarUser, type NavbarUser } from "@/src/lib/auth/get-navbar-user";

export default async function Navbar() {
  const user: NavbarUser | null = await getNavbarUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Brand + Campaigns */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Pure Hearts
            </span>
          </Link>

          {/* Campaigns link (desktop, tablet, and mobile) */}
          <div className="">
            <Link
              href="/campaigns"
              className="text-sm font-medium hover:text-primary"
            >
              Campaigns
            </Link>
          </div>
        </div>

        {/* Right: Desktop auth-aware actions */}
        <DesktopNav user={user} />

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}


