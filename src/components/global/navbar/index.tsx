import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { HeartHandshake } from "lucide-react";
import DesktopNav from "@/src/components/global/navbar/desktop-nav";
import MobileMenu from "@/src/components/global/navbar/mobile-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Pure Hearts
            </span>
          </Link>

          <div className="ml-6">
            <DesktopNav />
          </div>
        </div>

        {/* Right (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/quick-donation">Quick Donation</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" className="px-3">
            <Link href="/quick-donation">Quick Donation</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
