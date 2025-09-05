"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ChevronDown, HeartHandshake, Search } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/donation", label: "Donation" },
  { href: "/campaigns", label: "Campaign" },
]

const moreLinks = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/impact", label: "Impact" },
  { href: "/ledger", label: "Transparency Ledger" },
  { href: "/contact", label: "Contact" },
  { href: "/signin", label: "Sign In" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Brand + main navigation */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Pure Hearts</span>
          </Link>

          {/* Main links & More dropdown (desktop) */}
          <div className="hidden md:flex items-center gap-6 ml-6">
            <NavigationMenu>
              <NavigationMenuList>
                {mainLinks.map((l) => (
                  <NavigationMenuItem key={l.href}>
                    <Link href={l.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex select-none items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                          pathname === l.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        {l.label}
                      </NavigationMenuLink>
                    </Link>
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

            {/* Desktop search (to the right of More) */}
            <div className="ml-2">
              <SearchBox className="w-60" />
            </div>
          </div>
        </div>

        {/* Right side: CTAs (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/quick-donation">Quick Donation</Link>
          </Button>
        </div>

        {/* Mobile: quick donate + menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" className="px-3">
            <Link href="/quick-donation">Quick Donation</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

/** Reusable search box: submits to /search?q=... */
function SearchBox({ className }: { className?: string }) {
  const router = useRouter()
  const [q, setQ] = React.useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = q.trim()
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        inputMode="search"
        placeholder="Search"
        aria-label="Search"
        className="w-full pl-9"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="sr-only">Search</button>
    </form>
  )
}

function MobileMenu() {
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

        {/* Mobile search (PWA-friendly) */}
        <div className="px-4 py-3">
          <SearchBox />
        </div>

        <nav className="grid gap-1 p-2">
          <LinkItem href="/" label="Home" />
          <LinkItem href="/donation" label="Donation" />
          <LinkItem href="/quick-donation" label="Quick Donation" variant="primary" />
          <LinkItem href="/campaigns" label="Campaign" />
          <div className="px-2 pt-3 text-xs font-medium uppercase text-muted-foreground">More</div>
          <Separator className="mb-2" />
          {moreLinks.map((m) => (
            <LinkItem key={m.href} href={m.href} label={m.label} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function LinkItem({
  href,
  label,
  variant = "ghost",
}: {
  href: string
  label: string
  variant?: "ghost" | "outline" | "primary"
}) {
  const base =
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:brightness-110"
      : variant === "outline"
      ? "border border-input hover:bg-accent hover:text-accent-foreground"
      : "hover:bg-accent hover:text-accent-foreground"

  return (
    <Link href={href} className={cn(base, styles)}>
      {label}
    </Link>
  )
}
