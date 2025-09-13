"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { mainLinks, moreLinks } from "./links";
import SearchBox from "./search-box";

export default function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {mainLinks.map((l) => (
            <NavigationMenuItem key={l.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={l.href}
                  className={cn(
                    "group inline-flex select-none items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                >
                  {l.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {moreLinks.map((m) => (
                  <DropdownMenuItem key={m.href} asChild>
                    <Link href={m.href} className="w-full">
                      {m.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-2">
        <SearchBox className="w-60" />
      </div>
    </div>
  );
}
