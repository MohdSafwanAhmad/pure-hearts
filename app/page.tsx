import Hero from "@/components/hero"
import FeatureCampaigns from "@/components/featured-campaigns"
import DonationWorkflow from "@/components/donation-workflow"
import HowItWorks from "@/components/how-it-works"
import Footer from "@/components/footer"
        
export default function PureHeartsLandingPage() {
  return (
    <>
      <Hero />
      <FeatureCampaigns />
      <DonationWorkflow />
      <HowItWorks />
      <Footer />
    </>
  );
}
