import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Apple,
  Building2,
  Coins,
  Download,
  Globe,
  HeartHandshake,
  Layers3,
  Play,
  Repeat,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react"

export default function PureHeartsLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      {/* <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Pure Hearts</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Home
                </a>
                <a href="#features" className="text-muted-foreground hover:text-foreground">
                  Donation
                </a>
                <a href="#projects" className="text-muted-foreground hover:text-foreground">
                  Quick Donation
                </a>
                <a href="#methods" className="text-muted-foreground hover:text-foreground">
                  Campaign
                </a>
                <a href="#methods" className="text-muted-foreground hover:text-foreground">
                  More
                </a>

              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">Sign In</Button>
              <Button>Donate Now</Button>
            </div>
          </nav>
        </div>
      </header> */}

      {/* Hero Section */}
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
                <Button size="lg" className="text-lg px-8">
                  Donate Now
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Apply for Aid
                </Button>
              </div>
              <div className="flex gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Auditable on-chain ledger
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI eligibility & matching
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Zero office overhead
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8">
                <img
                  src="/pure-hearts-hero.jpg"
                  alt="Pure Hearts transparent donations"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Quote */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            “Give with confidence—track your impact from donation to delivery.”
          </h2>
          <p className="text-muted-foreground">— The Pure Hearts Promise</p>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Pure Hearts</h2>
            <p className="text-muted-foreground text-lg">
              Built for efficiency, trust, and dignity—for donors and beneficiaries alike.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Zero Admin Fees",
                description:
                  "Automation and volunteers eliminate office overhead so funds go directly to people in need.",
                icon: <Building2 className="w-12 h-12" />,
              },
              {
                title: "Transparent Ledger",
                description:
                  "Every transaction is recorded on a verifiable ledger for real-time visibility and auditability.",
                icon: <Layers3 className="w-12 h-12" />,
              },
              {
                title: "AI Matching",
                description:
                  "Eligibility is assessed online and donors can direct funds to categories or recipients ethically.",
                icon: <Target className="w-12 h-12" />,
              },
              {
                title: "Modern Payments",
                description:
                  "Wallet, one-time, recurring, prepayment, and crypto supported with secure online checkout.",
                icon: <Wallet className="w-12 h-12" />,
              },
              {
                title: "Global & Local",
                description:
                  "Support projects from Canadian provinces and U.S. states to international programs.",
                icon: <Globe className="w-12 h-12" />,
              },
              {
                title: "PWA + CMS",
                description: "Fast PWA experience with WordPress for content—simple to manage, easy to scale.",
                icon: <Smartphone className="w-12 h-12" />,
              },
              {
                title: "All Volunteers",
                description:
                  "Operations are powered by community volunteers; corporate sponsors cover platform costs.",
                icon: <Users className="w-12 h-12" />,
              },
              {
                title: "Open Reporting",
                description: "Full transparency of profile selection without exposing confidential details.",
                icon: <ShieldCheck className="w-12 h-12" />,
              },
            ].map((f, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                    {f.icon}
                  </div>
                  <CardTitle className="text-center">{f.title}</CardTitle>
                  <CardDescription className="text-center">{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs / Projects */}
      <section id="projects" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
            <p className="text-muted-foreground">Choose a cause or let our matching engine allocate your Zakat wisely.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Zakat Distribution",
                description: "Direct Zakat to verified recipients with full on-chain traceability.",
                image: "/project-zakat.jpg",
                rating: "4.9",
              },
              {
                title: "Orphan Sponsorship",
                description: "Sustain education & essentials for orphans via monthly support.",
                image: "/project-orphans.jpg",
                rating: "4.9",
              },
              {
                title: "Family Sponsorship",
                description: "Bridge urgent needs—rent, food, utilities—for vulnerable families.",
                image: "/project-family.jpg",
                rating: "4.8",
              },
              {
                title: "Students Sponsorship",
                description: "Back tuition and learning tools for deserving students.",
                image: "/project-students.jpg",
                rating: "4.8",
              },
              {
                title: "Furniture Bank",
                description: "Enable dignified living with essential furnishings for newcomers.",
                image: "/project-furniture.jpg",
                rating: "4.7",
              },
              {
                title: "Blockchain Transparency",
                description: "Explore the public ledger that powers our accountability.",
                image: "/project-blockchain.jpg",
                rating: "5.0",
              },
              {
                title: "Canadian Provinces",
                description: "Target aid across provinces with local partners.",
                image: "/project-canada.jpg",
                rating: "4.8",
              },
              {
                title: "US States & International",
                description: "Scale impact across borders with vetted initiatives.",
                image: "/project-international.jpg",
                rating: "4.7",
              },
            ].map((proj, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img src={proj.image || "/placeholder.svg"} alt={proj.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{proj.title}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{proj.rating}</span>
                    </div>
                  </div>
                  <CardDescription>{proj.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Button size="sm">Donate</Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How donations work (icon grid) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Your Donation Flows</h2>
            <p className="text-muted-foreground">
              Simple steps from contribution to verified delivery—fully auditable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Coins className="w-12 h-12" />,
                title: "Give",
                description:
                  "Donate via wallet, one-time, recurring, or prepay options—including crypto support.",
              },
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "Match",
                description: "AI matches funds to verified needs or to projects you choose explicitly.",
              },
              {
                icon: <Layers3 className="w-12 h-12" />,
                title: "Record",
                description: "Transactions are written to a transparent ledger without revealing identities.",
              },
              {
                icon: <ShieldCheck className="w-12 h-12" />,
                title: "Verify",
                description: "Eligibility and delivery steps are checked, logged, and reportable.",
              },
              {
                icon: <Repeat className="w-12 h-12" />,
                title: "Recur",
                description: "Set monthly or quarterly giving with adjustable caps and schedules.",
              },
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: "Track",
                description: "View impact dashboards and export receipts for your records.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-pretty">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Impact Stories</h2>
            <p className="text-muted-foreground">Real people. Real needs. Real transparency.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
              <img
                src="/impact-story-thumbnail.jpg"
                alt="Impact story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full w-20 h-20">
                  <Play className="w-8 h-8" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg">
                <p className="font-bold">“We saw where every dollar went.”</p>
                <p className="text-sm opacity-90">Donor & beneficiary story via the Pure Hearts ledger</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pure Hearts Impact — 2025</h2>
            <p className="opacity-90">Numbers that reflect efficiency, scale, and trust.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "0",
                unit: "Admin Fees",
                label: "All platform costs covered by sponsors",
                icon: <ShieldCheck className="w-8 h-8" />,
              },
              {
                number: "100%",
                unit: "To Beneficiaries",
                label: "Every donation allocated to aid",
                icon: <Coins className="w-8 h-8" />,
              },
              {
                number: "Real-Time",
                unit: "Transparency",
                label: "On-chain ledger & reports",
                icon: <Layers3 className="w-8 h-8" />,
              },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-4xl font-bold">{stat.number}</div>
                  <div className="text-xl opacity-90">{stat.unit}</div>
                </div>
                <p className="text-lg opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App / PWA */}
      <section id="methods" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30">PWA & Wallet</Badge>
              <h2 className="text-3xl font-bold">Give Anywhere, Track Everything</h2>
              <p className="text-muted-foreground text-lg text-pretty">
                Install the Pure Hearts PWA for a fast, app-like experience. Manage your wallet, set recurring giving,
                and export receipts. Content is managed in WordPress for easy updates.
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
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-5 h-5" />
                  Export Receipt
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto">
                <img
                  src="/pure-hearts-app.jpg"
                  alt="Pure Hearts PWA & wallet"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <li><a href="#projects" className="hover:opacity-100">Zakat</a></li>
                <li><a href="#projects" className="hover:opacity-100">Orphan Sponsorship</a></li>
                <li><a href="#projects" className="hover:opacity-100">Family Sponsorship</a></li>
                <li><a href="#projects" className="hover:opacity-100">Students Sponsorship</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Platform</h3>
              <ul className="space-y-2 opacity-90">
                <li><a href="#features" className="hover:opacity-100">Zero Admin Fees</a></li>
                <li><a href="#features" className="hover:opacity-100">Blockchain Transparency</a></li>
                <li><a href="#methods" className="hover:opacity-100">Wallet & Recurring</a></li>
                <li><a href="#" className="hover:opacity-100">Privacy & Terms</a></li>
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
    </div>
  )
}
