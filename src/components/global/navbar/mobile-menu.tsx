"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Menu, HeartHandshake } from "lucide-react";
import LinkItem from "./link-item";
import SearchBox from "./search-box";
import { moreLinks } from "./links";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Pure Hearts</span>
        </div>
        <Separator />

        <div className="px-4 py-3">
          <SearchBox />
        </div>

        <nav className="grid gap-1 p-2">
          <LinkItem href="/" label="Home" />
          <LinkItem href="/donation" label="Donation" />
          <LinkItem
            href="/quick-donation"
            label="Quick Donation"
            variant="primary"
          />
          <LinkItem href="/campaigns" label="Campaign" />
          <div className="px-2 pt-3 text-xs font-medium uppercase text-muted-foreground">
            More
          </div>
          <Separator className="mb-2" />
          {moreLinks.map((m) => (
            <LinkItem key={m.href} href={m.href} label={m.label} />
          ))}
        </nav>

        <div className="px-4 py-3 flex gap-2">
          <Button asChild variant="outline" className="w-1/2">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="w-1/2">
            <Link href="/quick-donation">Quick Donation</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
