import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Phone, Mail, ArrowRight } from 'lucide-react'

export default function FAQPage() {
  const tenantFaqs = [
    {
      q: 'What is PrimeHomeKanpur?',
      a: 'PrimeHomeKanpur is Kanpur\'s most trusted rental platform, operating since 2012. We help tenants find, compare, and secure verified rental homes, and help landlords rent out their properties faster with quality tenants. We currently handle rentals only — not buy/sell transactions.',
      defaultOpen: true,
    },
    {
      q: 'Do you help with buying or selling homes?',
      a: 'No. PrimeHomeKanpur is dedicated 100% to rental properties. This single-minded focus allows us to offer unmatched market intelligence, dedicated agent attention, and tenant-friendly service.',
    },
    {
      q: 'How often are listings updated?',
      a: 'Our listings are updated daily. When a property is rented or taken off the market, it is marked as rented or unpublished within 2 hours.',
    },
    {
      q: 'Do I need an account to use PrimeHomeKanpur?',
      a: 'No account is required to browse verified listings, search by neighborhood, or schedule visits. You can browse completely free of charge.',
    },
    {
      q: 'Can I contact an agent directly through your site?',
      a: 'Yes! Every property page and agent profile has direct phone, email, and WhatsApp links to the local agent assigned to that property or neighborhood.',
    },
    {
      q: 'What are your brokerage charges for tenants?',
      a: 'We charge a transparent, standard 1-month rent as brokerage upon successful lease signing. There are zero upfront fees, zero viewing charges, and no hidden costs.',
    },
    {
      q: 'Are the listing photos accurate?',
      a: 'Yes, 100%. Every single property in our catalog is physically visited and verified by our Head of Listings before going live. What you see online is what you see in person.',
    },
    {
      q: 'How do I schedule a site visit?',
      a: 'Simply fill the "Schedule a Visit" form on any property page or call our team directly. We will confirm your site visit within 2 hours.',
    },
    {
      q: 'Do you help with lease agreements and paperwork?',
      a: 'Yes. Our legal team drafts standardized 11-month legally vetted lease agreements and assists with police verification, stamp duty, and move-in checklists free of charge.',
    },
  ]

  const landlordFaqs = [
    {
      q: 'How much do you charge to list my property?',
      a: 'Landlords get free listing for the first 60 days including professional photography and cross-platform promotion. Upon finding a verified tenant, we offer special introductory rates.',
    },
    {
      q: 'How do you screen tenants for my property?',
      a: 'We conduct multi-layer verification including Aadhaar and PAN check, corporate employment verification, previous landlord background calls, and police tenant verification support.',
    },
    {
      q: 'How long does it take to rent out my property?',
      a: 'On average, our properties are rented within 7 to 14 days due to our active database of qualified Kanpur families and corporate professionals.',
    },
    {
      q: 'I\'m an NRI / outstation owner. Can you fully manage my property?',
      a: 'Yes! Our Annual Management service covers rent collection, quarterly visual inspections with photo reports, maintenance and repair oversight, and utility bill tracking.',
    },
  ]

  const generalFaqs = [
    {
      q: 'Which areas in Kanpur do you currently cover?',
      a: 'We cover 43+ prime neighborhoods including Gurudev Chauraha, Kakadeo, Vijay Nagar, Vikas Nagar, Awas Vikas, Swaroop Nagar, Civil Lines, Barra, Panki, Kidwai Nagar, and Kalyanpur.',
    },
    {
      q: 'Do you have a physical office I can visit?',
      a: 'Yes! Our office is located in Awadhpuri, Near Sales Tax Office, Kanpur – 208024. Feel free to visit us Mon – Sat between 9:30 AM and 7:30 PM.',
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
              Your rental questions, <span className="hl">honestly answered</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Call or email us — we answer every question within 24 hours, no exceptions.
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
                    We get it — every rental situation is unique. Our team is just a call or message away, and consultations are completely free.
                  </p>
                </div>

                {/* Call Us Card */}
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <h4 className="text-base font-bold text-white">Call Us Anytime</h4>
                  </div>
                  <a href="tel:+916398987290" className="text-xl font-extrabold text-primary block mb-2">
                    +91 6398987290
                  </a>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Mon – Sat: 9:00 AM – 8:00 PM<br />
                    Sunday: 10:00 AM – 4:00 PM
                  </p>
                </div>

                {/* Email Us Card */}
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h4 className="text-base font-bold text-white">Email Us</h4>
                  </div>
                  <a href="mailto:pathak424448@gmail.com" className="text-base font-bold text-primary block mb-2">
                    pathak424448@gmail.com
                  </a>
                  <p className="text-text-muted text-xs">
                    Average reply within 4 hours on working days.
                  </p>
                </div>

                <Link href="/contact" className="btn orange w-full">
                  Send Us a Message <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Right FAQ Accordions (60%) */}
              <div className="space-y-10">
                {/* For Tenants Group */}
                <div>
                  <div className="foot-title text-primary text-sm mb-4">FOR TENANTS</div>
                  <div className="faq space-y-2">
                    {tenantFaqs.map((faq) => (
                      <details key={faq.q} open={faq.defaultOpen} className="border-b border-line py-2">
                        <summary>{faq.q}</summary>
                        <p>{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* For Landlords Group */}
                <div>
                  <div className="foot-title text-primary text-sm mb-4">FOR LANDLORDS</div>
                  <div className="faq space-y-2">
                    {landlordFaqs.map((faq) => (
                      <details key={faq.q} className="border-b border-line py-2">
                        <summary>{faq.q}</summary>
                        <p>{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* General & Legal Group */}
                <div>
                  <div className="foot-title text-primary text-sm mb-4">GENERAL &amp; LEGAL</div>
                  <div className="faq space-y-2">
                    {generalFaqs.map((faq) => (
                      <details key={faq.q} className="border-b border-line py-2">
                        <summary>{faq.q}</summary>
                        <p>{faq.a}</p>
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
                Didn&apos;t find your answer? <span className="hl">We&apos;re here to help.</span>
              </h2>
              <p>
                Send us a quick message and one of our rental experts will get back to you personally within a few hours — no chatbots, no ticket numbers.
              </p>
              <div className="cta-btns">
                <Link href="/contact" className="btn orange">
                  Send a Message
                </Link>
                <a href="tel:+916398987290" className="btn dark">
                  <Phone className="w-4 h-4 mr-1 text-[#EC4899]" /> Call +91 6398987290
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
