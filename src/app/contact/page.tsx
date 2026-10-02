import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import SectionHeading from '@/components/sections/SectionHeading'
import { MapPin, Mail, Phone, Send, ArrowRight } from 'lucide-react'

export default function ContactPage() {
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
                  Contact
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-6">
                Get in <span className="text-primary">touch</span> with us
              </h1>
              
              <p className="text-text-secondary text-lg mb-8 max-w-2xl">
                Have questions about our rental services? Want to schedule a property visit? We're here to help. Reach out to us and we'll get back to you as soon as possible.
              </p>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <SectionHeading
                  title="Contact"
                  highlight="information"
                />

                <div className="space-y-6">
                  {[
                    {
                      icon: <MapPin className="w-6 h-6 text-gray-900" />,
                      title: 'Office Address',
                      body: (
                        <> Awadhpuri, Near Sales Tax Office,<br /> Kanpur – 208024 </>
                      ),
                    },
                    {
                      icon: <Phone className="w-6 h-6 text-gray-900" />,
                      title: 'Phone',
                      body: <a href="tel:+916398987290" className="text-text-secondary text-sm hover:text-primary transition-colors">+91 6398987290</a>,
                    },
                    {
                      icon: <Mail className="w-6 h-6 text-gray-900" />,
                      title: 'Email',
                      body: <a href="mailto:pathak424448@gmail.com" className="text-text-secondary text-sm hover:text-primary transition-colors">pathak424448@gmail.com</a>,
                    },
                  ].map((item) => (
                    <div key={item.title} className="feature-card rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="icon-shell w-12 h-12 rounded-lg bg-primary text-gray-900 flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                          <div className="text-text-secondary text-sm">{item.body}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="mt-8 aspect-video bg-surface-elevated border border-border rounded-xl grid-pattern"></div>
              </div>

              {/* Contact Form */}
              <div>
                <SectionHeading
                  title="Send us a"
                  highlight="message"
                />

                <form className="bg-surface border border-border rounded-[1.5rem] p-6 space-y-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
                  <div>
                    <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <Input placeholder="Your name" required />
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                      Phone
                    </label>
                    <Input type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <Input placeholder="How can we help?" required />
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us more about your requirements..."
                      required
                    />
                  </div>

                  <Button variant="primary" size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="bg-surface-elevated border border-border rounded-[2rem] p-8 md:p-12 text-center shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-4">
                Prefer to <span className="text-primary">call us?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Our team is available during business hours to answer your questions and help you with your rental needs.
              </p>
              <Button variant="primary" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
