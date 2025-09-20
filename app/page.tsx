// app/page.tsx
import Hero from "@/src/components/page/pure-hearts-landing-page/hero"
import FeaturedCampaigns from "@/src/components/page/pure-hearts-landing-page/featured-campaigns"
import DonationWorkflow from "@/src/components/page/pure-hearts-landing-page/donation-workflow"
import Footer from "@/src/components/page/pure-hearts-landing-page/footer"
import { getAllProjects } from "@/src/api/project"

export default async function PureHeartsLandingPage() {
  const projects = await getAllProjects(4) // only fetch 4 for featured

  return (
    <>
      <Hero />
      <FeaturedCampaigns projects={projects} />
      <DonationWorkflow />
      <Footer />
    </>
  )
}