import Hero from "@/src/components/page/pure-hearts-landing-page/hero";
import FeatureCampaigns from "@/src/components/page/pure-hearts-landing-page/feature-campaigns";
import DonationWorkflow from "@/src/components/page/pure-hearts-landing-page/donation-workflow";
import HowItWorks from "@/src/components/page/pure-hearts-landing-page/how-it-works";
import Footer from "@/src/components/page/pure-hearts-landing-page/footer";

export default function PureHeartsLandingPage() {
  return (
    <>
      <Hero />
      <FeaturedCampaigns projects={projects} />
      <DonationWorkflow />
      <Footer />
    </>
  )
}