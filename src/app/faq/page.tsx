import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Phone, Mail, ArrowRight } from 'lucide-react'

export default function FAQPage() {
  const coreFaqs = [
    {
      q: 'Do I need an account to use PrimeHomeKanpur?',
      a: 'Yes. You can browse and explore properties without an account, but you need to sign in to use features such as wishlist, booking a property visit, contacting us through authenticated services, and submitting reviews.',
      defaultOpen: true,
    },
    {
      q: 'What are your brokerage charges for tenants?',
      a: 'Our brokerage charge for tenants is 15 days\' rent. The visit charge is ₹300, and call consultation is free.',
      defaultOpen: true,
    },
    {
      q: 'How much do you charge to list my property?',
      a: 'If the property\'s rent is above ₹10,000 per month, the listing charge is ₹2,000, followed by 15 days\' rent as brokerage after the deal is completed. If the property\'s rent is below ₹10,000 per month, the listing charge is ₹1,000, followed by 15 days\' rent as brokerage after the deal is completed.',
      defaultOpen: true,
    },
    {
      q: 'Are listings physically verified before going live?',
      a: 'Yes, 100%. Every single property in our catalog is physically visited and verified by our Head of Listing & Management before going live. What you see online matches reality in person.',
    },
    {
      q: 'How do I schedule a site visit?',
      a: 'Open any property page and click "Schedule a Visit" or use your account dashboard. Our listing team confirms the appointment quickly.',
    },
    {
      q: 'Do you help with lease agreements and paperwork?',
      a: 'Yes. Our team assists with standard 11-month legally vetted lease agreements, landlord documentation, and police verification support.',
    },
  ]

  const landlordFaqs = [
    {
      q: 'How do you screen tenants for my property?',
      a: 'We conduct thorough identity and background screening including government ID check, employment / corporate verification, previous landlord calls, and family occupancy confirmation.',
    },
    {
      q: 'How long does it take to rent out a property?',
      a: 'On average, verified properties on PrimeHomeKanpur receive serious inquiries and find confirmed tenants within 7 to 14 days.',
    },
    {
      q: 'Which areas in Kanpur do you cover?',
      a: 'We actively cover over 40 Kanpur neighborhoods including Civil Lines, Swaroop Nagar, Kakadeo, Gurudev Chauraha, Vikas Nagar, Awas Vikas, Vijay Nagar, Barra, Govind Nagar, Kidwai Nagar, and Kalyanpur.',
    },
  ]

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
              <span>FAQs</span>
            </div>

            <span className="pill mb-4"><span className="dot" />FAQ</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Your rental questions, <span className="hl">clearly answered</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              Find transparent answers about our 15-day brokerage, ₹300 visit charges, accounts, and landlord listing tiers.
            </p>
          </div>
        </section>

        {/* 2. Main Two-Column FAQ Section */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="faq-wrap items-start gap-12">
              {/* Left Sticky Sidebar (40%) */}
              <div className="space-y-6 lg:sticky lg:top-24">
                <div>
                  <span className="pill mb-4"><span className="dot" />Still confused?</span>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Have a question that&apos;s <span className="hl">not listed here?</span>
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    Our Kanpur team is just a phone call away, and phone consultation is always 100% free.
                  </p>
                </div>

                {/* Call Us Card */}
                <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <h4 className="text-base font-bold text-white">Call Us Anytime</h4>
                  </div>
                  <a href="tel:+919151435647" className="text-xl font-extrabold text-primary block mb-2">
                    +91 9151435647
                  </a>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Mon – Sat: 9:30 AM – 7:30 PM<br />
                    Sunday: By Appointment
                  </p>
                </div>

                {/* Email Us Card */}
                <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h4 className="text-base font-bold text-white">Email Us</h4>
                  </div>
                  <a href="mailto:primehomekanpur@gmail.com" className="text-base font-bold text-primary block mb-2 truncate">
                    primehomekanpur@gmail.com
                  </a>
                  <p className="text-text-muted text-xs">
                    Prompt response from our management team.
                  </p>
                </div>

                <Link href="/contact" className="btn orange w-full btn-loop-shine">
                  Send Us a Message <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Right FAQ Accordions (60%) */}
              <div className="space-y-10">
                {/* Core & Tenant Questions */}
                <div>
                  <div className="foot-title text-primary text-sm mb-4">ACCOUNT &amp; TENANT QUESTIONS</div>
                  <div className="faq space-y-3">
                    {coreFaqs.map((faq) => (
                      <details key={faq.q} open={faq.defaultOpen} className="border-b border-line py-3">
                        <summary className="font-bold text-white cursor-pointer hover:text-accent-cyan transition-colors">{faq.q}</summary>
                        <p className="text-text-secondary text-sm leading-relaxed mt-2.5">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* Landlords Questions */}
                <div>
                  <div className="foot-title text-primary text-sm mb-4">LANDLORDS &amp; COVERAGE</div>
                  <div className="faq space-y-3">
                    {landlordFaqs.map((faq) => (
                      <details key={faq.q} className="border-b border-line py-3">
                        <summary className="font-bold text-white cursor-pointer hover:text-accent-cyan transition-colors">{faq.q}</summary>
                        <p className="text-text-secondary text-sm leading-relaxed mt-2.5">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CTA */}
        <section className="sect pt-0">
          <div className="wrap">
            <div className="cta-section">
              <h2>
                Ready to find or list a rental in <span className="hl">Kanpur?</span>
              </h2>
              <p>
                Call us directly at <span className="text-white font-bold">+91 9151435647</span> or browse verified homes.
              </p>
              <div className="cta-btns">
                <Link href="/rentals" className="btn orange btn-loop-shine">
                  Browse Rentals
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
