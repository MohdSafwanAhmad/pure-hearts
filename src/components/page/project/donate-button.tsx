"use client";

import { Button } from "@/src/components/ui/button";

export function DonateButton() {
  const handleClick = () => {
    const donationSection = document.querySelector('.donation-section');
    if (donationSection) {
      window.scrollTo({
        top: donationSection.getBoundingClientRect().top + window.scrollY - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Button size="lg" onClick={handleClick}>
      Donate Now
    </Button>
  );
}