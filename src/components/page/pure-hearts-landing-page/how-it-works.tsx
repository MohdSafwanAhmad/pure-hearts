import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Apple, Download, Repeat, Smartphone, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="methods" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
              PWA & Wallet
            </Badge>
            <h2 className="text-3xl font-bold">
              Give Anywhere, Track Everything
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              Install the Pure Hearts PWA for a fast, app-like experience.
              Manage your wallet, set recurring giving, and export receipts.
              Content is managed in WordPress for easy updates.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Impact dashboards & downloadable reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <span>Offline-friendly PWA experience</span>
              </div>
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-primary" />
                <span>Recurring, prepayment, and one-shot donations</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Install PWA
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="w-5 h-5" />
                Export Receipt
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              <Image
                src="/pure-hearts-app.jpg"
                alt="Pure Hearts PWA & wallet"
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
