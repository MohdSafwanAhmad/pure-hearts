"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

const slides = [
  { src: "/hero/aid-kits.png", alt: "Volunteers preparing aid kits" },
  { src: "/hero/food-baskets.png", alt: "Food basket distribution" },
  { src: "/hero/orphan-support.jpg", alt: "Little Child" },
];

export default function Hero() {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[70vh] md:min-h-[64vh] lg:min-h-[70vh] flex items-center justify-center">
      {/* Background carousel */}
      {slides.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          priority={i === 0}
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" /> {/* overlay for contrast */}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Transparent Giving. Zero Admin Fees.
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8 text-lg">
            <Link href="/donation">Donate Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="px-8 text-lg bg-white/20 text-white border-white/40 hover:bg-white/30"
          >
            <Link href="/apply">Apply for Aid</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
