"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function LinkItem({
  href,
  label,
  variant = "ghost",
}: {
  href: string
  label: string
  variant?: "ghost" | "outline" | "primary"
}) {
  const pathname = usePathname()
  const active = pathname === href

  const base =
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:brightness-110"
      : variant === "outline"
      ? "border border-input hover:bg-accent hover:text-accent-foreground"
      : "hover:bg-accent hover:text-accent-foreground"

  return (
    <Link href={href} className={cn(base, styles, active && "bg-accent text-accent-foreground")}>
      {label}
    </Link>
  )
}
