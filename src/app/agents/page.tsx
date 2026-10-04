import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AgentCard from '@/components/cards/AgentCard'
import LocationAreaCard from '@/components/cards/LocationAreaCard'
import { getAgents } from '@/lib/data/agents'
import { popularAreas } from '@/lib/data/areas'
import { ShieldCheck, MapPin, Clock, Sparkles, Phone } from 'lucide-react'

export default async function AgentsPage() {
  const agents = await getAgents()

  const row1Areas = popularAreas.slice(0, 5)
  const row2Areas = popularAreas.slice(5)

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main>
        {/* 1. Page Hero */}
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Our Agents</span>
            </div>

            <span className="pill mb-4"><span className="dot" />Meet Our Agents</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Kanpur&apos;s most trusted <span className="hl">rental experts</span>, here for you
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              Every agent at PrimeHomeKanpur lives and breathes Kanpur real estate. Pick your preferred neighborhood and get matched with a local expert who knows the area inside out.
            </p>
          </div>
        </section>

        {/* 2. Agent Listings Grid */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Our Team</span>
              <h2 className="mx-auto">The people who&apos;ll help you find <span className="hl">your next home</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                14+ years Kanpur experience · Transparent 15-day brokerage · ₹300 visit fee
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {agents.slice(0, 3).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Area Coverage */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="pill mx-auto mb-4"><span className="dot" />Area Coverage</span>
              <h2 className="mx-auto">Every neighborhood in <span className="hl">Kanpur</span>, covered</h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                Our agents operate across all major Kanpur areas — so wherever you need to rent, we have a local expert ready.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Row 1 Marquee */}
            <div className="marquee">
              <div className="marquee-track">
                {[...row1Areas, ...row1Areas, ...row1Areas, ...row1Areas].map((area, idx) => (
                  <LocationAreaCard key={`r1-${area.name}-${idx}`} area={area} />
                ))}
              </div>
            </div>

            {/* Row 2 Marquee */}
            <div className="marquee">
              <div className="marquee-track" style={{ animationDirection: 'reverse' }}>
                {[...row2Areas, ...row2Areas, ...row2Areas, ...row2Areas].map((area, idx) => (
                  <LocationAreaCard key={`r2-${area.name}-${idx}`} area={area} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Agent Promise */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="why-grid items-center gap-12">
              <div className="relative w-full aspect-[4/3] max-w-md mx-auto lg:max-w-none">
                <div className="absolute top-0 left-0 w-[80%] h-[80%] rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7c3aed] border-2 border-violet/30 shadow-[0_20px_50px_rgba(124,58,237,0.35)]" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#00c2d9] border-2 border-primary/40 shadow-[0_25px_60px_rgba(0,194,217,0.25)] p1" />
              </div>

              <div>
                <span className="pill mb-4"><span className="dot" />Agent Promise</span>
                <h2 className="mb-6">What working with a PrimeHomeKanpur agent <span className="hl">actually means</span></h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <ShieldCheck className="w-5 h-5 text-gray-900" />,
                      title: "You'll never feel pressured",
                      description: "Our agents prioritize long-term client trust over rushed deals. Zero pushy sales tactics, ever.",
                    },
                    {
                      icon: <MapPin className="w-5 h-5 text-gray-900" />,
                      title: "They know every Kanpur street like a local",
                      description: "Which societies have 24×7 power backup? Which pockets have quiet family neighborhoods? We guide you honestly.",
                    },
                    {
                      icon: <Clock className="w-5 h-5 text-gray-900" />,
                      title: "Fast responsiveness & physical tours",
                      description: "We schedule visits quickly at a flat ₹300 charge and assist with lease verification.",
                    },
                    {
                      icon: <Sparkles className="w-5 h-5 text-gray-900" />,
                      title: "Free call consultation",
                      description: "Call us anytime for market rent estimates, landlord terms, or neighborhood suggestions.",
                    },
                  ].map((item, idx) => (
                    <div key={item.title} className={`flex gap-4 items-start ${idx > 0 ? 'pt-4 border-t border-line/60' : ''}`}>
                      <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                        {item.icon}
                      </div>
                      <div>
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

        {/* 5. CTA */}
        <section className="sect pt-0">
          <div className="wrap">
            <div className="cta-section">
              <h2>
                Want to connect with our <span className="hl">listing executive?</span>
              </h2>
              <p>
                Tell us your preferred area or budget, or call us directly at <span className="text-white font-bold">+91 9151435647</span>.
              </p>
              <div className="cta-btns">
                <Link href="/contact" className="btn orange btn-loop-shine">
                  Request an Agent
                </Link>
                <a href="tel:+919151435647" className="btn dark">
                  <Phone className="w-4 h-4 mr-1 text-[#EC4899]" /> Call +91 9151435647
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
