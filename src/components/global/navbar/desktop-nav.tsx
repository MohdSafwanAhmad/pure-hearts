//src/components/global/navbar/desktop-nav.tsx

/**
 * What’s gone:
- Donate
-  More
- Quick Donation
- auth guessing

What was added:
- Auth-aware
- Profile links correct for donor/organization
- Logout > / */

"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import LogoutButton from "@/src/components/global/logout-button";
import SearchBox from "./search-box";

type NavbarUser =
  | {
      type: "donor" | "organization";
      profileHref: string;
    }
  | null;

export default function DesktopNav({ user }: { user: NavbarUser }) {
  return (
    <div className="hidden md:flex items-center gap-4">
      <SearchBox className="w-60" />

      {!user && (
        <>
          <Button asChild variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}

      {user && (
        <>
          <Button asChild variant="outline">
            <Link href={user.profileHref}>Profile</Link>
          </Button>

                  {/* Right (desktop) */}
           <Button asChild>
             <Link href="/">Logout</Link>
           </Button>

        </>
      )}
    </div>
  );
}

