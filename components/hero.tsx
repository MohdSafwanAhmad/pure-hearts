import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ShieldCheck, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
              Tech-Driven Zakat & Charity Initiative
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-balance">
              Transparent Giving. Zero Admin Fees.
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Pure Hearts is a modern donations platform that uses automation, AI, and blockchain to make Zakat and
              charity distribution efficient, transparent, and accessible—so every dollar reaches people who need it.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="text-lg px-8">Donate Now</Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">Apply for Aid</Button>
            </div>
            <div className="flex gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Auditable on-chain ledger</div>
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI eligibility & matching</div>
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Zero office overhead</div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 relative">
              <Image
                src="/image1.jpg"
                alt="Pure Hearts transparent donations"
                fill
                className="object-cover rounded-2xl"
               /* sizes="(min-width: 1024px) 200px, 100vw"*/
                sizes="300px"
               priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
