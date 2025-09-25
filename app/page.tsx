import Hero from "@/src/components/page/pure-hearts-landing-page/hero";
import FeaturedCampaigns from "@/src/components/page/pure-hearts-landing-page/featured-campaigns";
import DonationWorkflow from "@/src/components/page/pure-hearts-landing-page/donation-workflow";
import Footer from "@/src/components/page/pure-hearts-landing-page/footer";
//import { ping } from "@/src/lib/supabase/queries/get-featured-projects";

export default function PureHeartsLandingPage() {
  return (
    <>
      <Hero />
      <FeaturedCampaigns /> {/* no props */}
      <DonationWorkflow />
      <Footer />
    </>
  );
}
