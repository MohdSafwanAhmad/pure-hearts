import { Coins, Layers3, Repeat, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"

const steps = [
  { icon: Coins,       title: "Give",    description: "Donate via wallet, one-time, recurring, or prepay options—including crypto support." },
  { icon: Sparkles,    title: "Match",   description: "AI matches funds to verified needs or to projects you choose explicitly." },
  { icon: Layers3,     title: "Record",  description: "Transactions are written to a transparent ledger without revealing identities." },
  { icon: ShieldCheck, title: "Verify",  description: "Eligibility and delivery steps are checked, logged, and reportable." },
  { icon: Repeat,      title: "Recur",   description: "Set monthly or quarterly giving with adjustable caps and schedules." },
  { icon: TrendingUp,  title: "Track",   description: "View impact dashboards and export receipts for your records." },
]

export default function DonationWorkflow() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Your Donation Flows</h2>
          <p className="text-muted-foreground">Simple steps from contribution to verified delivery—fully auditable.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground text-pretty">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
