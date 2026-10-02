import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import AgentCard from '@/components/cards/AgentCard'
import SectionHeading from '@/components/sections/SectionHeading'
import { getAgents } from '@/lib/data/agents'
import { ArrowRight, Check, Phone, ShieldCheck, MapPin, Clock, Sparkles } from 'lucide-react'

export default async function AgentsPage() {
  const agents = await getAgents()

  const areas = [
    { name: 'Gurudev Chauraha', gradient: 'from-[#0F766E] to-[#00C2D9]' },
    { name: 'Kakadeo', gradient: 'from-[#4C1D95] to-[#7C3AED]' },
    { name: 'Vijay Nagar', gradient: 'from-[#7F1D1D] to-[#EF4444]' },
    { name: 'Vikas Nagar', gradient: 'from-[#134E4A] to-[#2DD4BF]' },
    { name: 'Awas Vikas', gradient: 'from-[#5B21B6] to-[#8B5CF6]' },
    { name: 'Sharda Nagar', gradient: 'from-[#0891B2] to-[#22D3EE]' },
    { name: 'Shastri Nagar', gradient: 'from-[#4C1D95] to-[#7C3AED]' },
    { name: 'Barra', gradient: 'from-[#7F1D1D] to-[#EF4444]' },
    { name: 'Panki', gradient: 'from-[#0F766E] to-[#00C2D9]' },
    { name: 'Kidwai Nagar', gradient: 'from-[#5B21B6] to-[#8B5CF6]' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-bg purple-glow diagonal-pattern py-20 md:py-28">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-deep border border-violet mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  Meet Our Agents
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-6">
                Kanpur&apos;s most trusted <span className="text-primary">rental experts</span>, here for you
              </h1>
              
              <p className="text-text-secondary text-lg mb-8 max-w-2xl">
                Every agent at PrimeHomeKanpur lives and breathes Kanpur real estate. Pick your preferred neighborhood and get matched with a local expert who knows the area inside out.
              </p>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span>Our Agents</span>
              </div>
            </div>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              title="The people who'll help you find"
              highlight="your next home"
              description="Average 8+ years experience each · 500+ cumulative deals closed · 4.9★ client rating"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="bg-bg-purple py-20 border-t border-border/40">
          <div className="container-custom">
            <SectionHeading
              pill="Area Coverage"
              title="Every neighborhood in"
              highlight="Kanpur, covered"
              description="Our agents operate across all major Kanpur areas — so wherever you need to rent, we have a local expert."
            />

            <div className="marquee">
              <div className="marquee-track">
                {[...areas, ...areas].map((area, index) => (
                  <div
                    key={`${area.name}-${index}`}
                    className={`relative w-[220px] shrink-0 aspect-[4/3] rounded-2xl bg-gradient-to-br ${area.gradient} grid-pattern overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-base md:text-lg leading-snug">{area.name}</h3>
                      <p className="text-white/70 text-xs md:text-sm">Kanpur</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What It Means */}
        <section className="bg-bg py-20 border-t border-border/40">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Visual - Two overlapping cards */}
              <div className="relative w-full aspect-[4/3] max-w-md mx-auto lg:max-w-none">
                {/* Back card - Purple gradient */}
                <div className="absolute top-0 left-0 w-[78%] h-[78%] rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7c3aed] border-2 border-violet/30 shadow-[0_20px_50px_rgba(124,58,237,0.35)]" />
                {/* Front card - Teal/cyan gradient */}
                <div className="absolute bottom-0 right-0 w-[78%] h-[78%] rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#00c2d9] border-2 border-primary/40 shadow-[0_25px_60px_rgba(0,194,217,0.25)] grid-pattern" />
              </div>

              {/* Content */}
              <div>
                <SectionHeading
                  pill="Agent Promise"
                  title="What working with a PrimeHomeKanpur agent"
                  highlight="actually means"
                />

                <div className="space-y-6">
                  {[
                    {
                      icon: <ShieldCheck className="w-5 h-5 text-gray-900" />,
                      title: "You'll never feel pressured",
                      description: "Our agents work on your schedule, never theirs. Zero pressure, no pushy sales, no hidden fees ever.",
                    },
                    {
                      icon: <MapPin className="w-5 h-5 text-gray-900" />,
                      title: "They know the area like a local",
                      description: "Traffic patterns, best schools, 24/7 pharmacies, reliable internet providers — everything that isn't on real estate portals.",
                    },
                    {
                      icon: <Clock className="w-5 h-5 text-gray-900" />,
                      title: "Fast, 24/7 responsiveness",
                      description: "Average first response time is under 20 minutes. WhatsApp, phone, or email — meeting each client where you are comfortable.",
                    },
                    {
                      icon: <Sparkles className="w-5 h-5 text-gray-900" />,
                      title: "Bonus: free move-in support",
                      description: "A move-in checklist for utilities, trusted mover referrals, and our exclusive welcome guide for every neighborhood.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="feature-card flex gap-4 items-start rounded-2xl p-4">
                      <div className="icon-shell w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md text-gray-900">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-bg-purple py-20 border-t border-border/40">
          <div className="container-custom">
            <div className="bg-surface-elevated border border-border rounded-3xl p-8 md:p-12 text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Want to work with a <span className="text-primary">specific agent?</span>
              </h2>
              <p className="text-text-secondary text-base md:text-lg mb-8 max-w-2xl mx-auto">
                Tell us your preferred area, budget, or agent name — and we&apos;ll connect you directly. No IVR, no waiting, just real humans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Request an Agent
                </Button>
                <a
                  href="tel:+916398987290"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-violet-deep border border-violet text-white font-semibold text-sm hover:bg-violet transition-colors w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 mr-2 text-accent-pink" />
                  Call Now: +91 6398987290
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
