import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/sections/SectionHeading'
import FaqItem from '@/components/ui/FaqItem'
import { getFAQs } from '@/lib/data/faqs'
import { ArrowRight, MessageSquare } from 'lucide-react'

export default async function FAQPage() {
  const faqs = await getFAQs()

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
                  FAQ
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-6">
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
              
              <p className="text-text-secondary text-lg mb-8 max-w-2xl">
                Find answers to common questions about our rental services, property listings, and the rental process in Kanpur.
              </p>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span>FAQ</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              title="Got questions?"
              highlight="We've got answers"
            />

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="bg-surface-elevated border border-border rounded-[2rem] p-8 md:p-12 text-center shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-4">
                Still have <span className="text-primary">questions?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask a Question
                </Button>
                <Button variant="secondary" size="lg">
                  Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
