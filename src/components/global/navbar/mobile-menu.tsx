//src/components/global/navbar/mobile-menu.tsx

/**
 * Changed in mobile menu as agreed earlier:
Hamburger stays
Campaigns moved near logo
Search untouched
No Donate
No More
No Quick Donation
Auth-aware buttons
*/

"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/src/components/ui/sheet";
import { Menu, HeartHandshake } from "lucide-react";
import SearchBox from "./search-box";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LogoutButton from "@/src/components/global/logout-button";

type NavbarUser =
  | {
      type: "donor" | "organization";
      profileHref: string;
    }
  | null;

export default function MobileMenu({ user }: { user: NavbarUser }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0">
        {/* Header */}
  <VisuallyHidden>
    <SheetTitle>Mobile navigation menu</SheetTitle>
  </VisuallyHidden>
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Pure Hearts</span>
        </div>

        {/* Campaigns link under logo */}
        <div className="px-4 pb-2">
          <Link
            href="/campaigns"
            className="text-sm font-medium hover:text-primary"
          >
            Campaigns
          </Link>
        </div>

        <Separator />

        {/* Search (unchanged) */}
        <div className="px-4 py-3">
          <SearchBox />
        </div>

        <Separator />

        {/* Auth actions */}
        <div className="px-4 py-4 flex gap-2">
          {!user && (
            <>
              <Button asChild variant="outline" className="w-1/2">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="w-1/2">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          {user && (
            <>
              <Button asChild variant="outline" className="w-1/2">
                <Link href={user.profileHref}>Profile</Link>
              </Button>
           <Button asChild className="w-1/2">
             <Link href="/">Logout</Link>
           </Button>            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

