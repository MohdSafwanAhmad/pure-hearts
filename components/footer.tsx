import Link from "next/link"
import { HeartHandshake } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Pure Hearts</span>
            </div>
            <p className="opacity-90 text-pretty">
              A tech-driven donation platform delivering Zakat and charity with zero admin fees and full transparency.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Give</h3>
            <ul className="space-y-2 opacity-90">
              <li><Link href="#projects" className="hover:opacity-100">Zakat</Link></li>
              <li><Link href="#projects" className="hover:opacity-100">Orphan Sponsorship</Link></li>
              <li><Link href="#projects" className="hover:opacity-100">Family Sponsorship</Link></li>
              <li><Link href="#projects" className="hover:opacity-100">Students Sponsorship</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Platform</h3>
            <ul className="space-y-2 opacity-90">
              <li><Link href="#features" className="hover:opacity-100">Zero Admin Fees</Link></li>
              <li><Link href="#features" className="hover:opacity-100">Blockchain Transparency</Link></li>
              <li><Link href="#methods" className="hover:opacity-100">Wallet & Recurring</Link></li>
              <li><Link href="#" className="hover:opacity-100">Privacy & Terms</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact</h3>
            <ul className="space-y-2 opacity-90">
              <li>Montreal, Canada</li>
              <li>+1 (555) 123-4567</li>
              <li>support@purehearts.org</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center opacity-90">
          <p>&copy; 2025 Pure Hearts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
