import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { MapPin, Phone, Mail, Car, Send } from 'lucide-react'

export default function ContactPage() {
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
              <span>Contact Us</span>
            </div>

            <span className="pill mb-4"><span className="dot" />Contact Us</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Let&apos;s talk about your <span className="hl">rental needs</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              Whether you&apos;re looking for a home, need to list your property, or just have questions — we respond to every single message within a few hours. Yes, really.
            </p>
          </div>
        </section>

        {/* 2. Contact Main (Left Stacked Cards + Right Form) */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column (5 cols) - 4 Stacked Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                {/* Office Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <MapPin className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Our Office</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        Awadhpuri, Near Sales Tax Office,<br />
                        Kanpur, Uttar Pradesh – 208024
                      </p>
                      <p className="text-text-muted text-xs">
                        <strong>Working Hours:</strong> Mon – Sat: 9:00 AM – 8:00 PM<br />
                        Sunday: 10:00 AM – 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call / WhatsApp Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <Phone className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg mb-1">Call / WhatsApp</h3>
                      <a href="tel:+916398987290" className="text-xl font-extrabold text-primary block">
                        +91 6398987290
                      </a>
                      <a
                        href="https://wa.me/916398987290"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline block"
                      >
                        Open WhatsApp chat &rarr;
                      </a>
                      <p className="text-text-muted text-xs pt-1">
                        Average pick-up time: <strong>under 3 rings</strong><br />
                        Average response on WhatsApp: <strong>18 minutes</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <Mail className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                      <a href="mailto:pathak424448@gmail.com" className="text-base font-bold text-primary block mb-1">
                        pathak424448@gmail.com
                      </a>
                      <p className="text-text-muted text-xs leading-relaxed">
                        General queries: reply within 4 hours<br />
                        Urgent / deal-related: reply within 1 hour
                      </p>
                    </div>
                  </div>
                </div>

                {/* Getting Here Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <Car className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Getting Here</h3>
                      <ul className="text-xs text-text-secondary space-y-1 mb-2">
                        <li>• Nearest Bus Stop: Awadhpuri Stop (2 min walk)</li>
                        <li>• Kanpur Central Railway Station: 9 km (~25 min)</li>
                        <li>• Kanpur Airport: 15 km (~35 min)</li>
                      </ul>
                      <span className="text-primary text-xs font-semibold">
                        Free parking available for clients visiting our office
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols) - Form Card & Map */}
              <div className="lg:col-span-7 space-y-8">
                {/* Form Card */}
                <div className="card p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                  <span className="pill mb-4"><span className="dot" />Send Us a Message</span>
                  <h3 className="text-2xl font-bold text-white mb-2">We&apos;d love to hear from you</h3>
                  <p className="text-text-muted text-sm mb-8">
                    Fill the form below — it takes less than 2 minutes. We&apos;ll get back to you personally.
                  </p>

                  <form className="space-y-5">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="field">
                        <label htmlFor="contact-name">Full Name *</label>
                        <input id="contact-name" type="text" placeholder="John Doe" required />
                      </div>
                      <div className="field">
                        <label htmlFor="contact-phone">Phone Number *</label>
                        <input id="contact-phone" type="tel" placeholder="+91 98765 43210" required />
                      </div>
                    </div>

                    {/* Row 2: Email & Interested In */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="field">
                        <label htmlFor="contact-email">Email Address</label>
                        <input id="contact-email" type="email" placeholder="john@example.com" />
                      </div>
                      <div className="field">
                        <label htmlFor="contact-interest">I&apos;m interested in *</label>
                        <select id="contact-interest" defaultValue="Renting a property">
                          <option value="Renting a property">Renting a property</option>
                          <option value="Listing my property">Listing my property</option>
                          <option value="Property management">Property management</option>
                          <option value="Rent appraisal">Rent appraisal</option>
                          <option value="Lease documentation">Lease documentation</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Location */}
                    <div className="field">
                      <label htmlFor="contact-location">Preferred Location (if searching)</label>
                      <input id="contact-location" type="text" placeholder="e.g. Kakadeo, Vikas Nagar, Civil Lines" />
                    </div>

                    {/* Message / Requirements */}
                    <div className="field">
                      <label htmlFor="contact-msg">Your Message / Requirements *</label>
                      <textarea
                        id="contact-msg"
                        rows={4}
                        placeholder="Tell us a bit about what you're looking for — budget, BHK, move-in date, etc. The more detail, the better we can help!"
                        required
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        required
                        className="mt-1 h-4 w-4 rounded border-border bg-[#0A0719] text-primary focus:ring-primary"
                      />
                      <label htmlFor="consent" className="text-xs text-text-secondary leading-normal">
                        I agree to the <Link href="/privacy-policy" className="text-primary underline">Privacy Policy</Link> and consent to PrimeHomeKanpur contacting me about my query.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn orange w-full mt-4 text-base py-3">
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </button>
                  </form>
                </div>

                {/* Visit Our Office Map Card */}
                <div>
                  <span className="pill mb-4"><span className="dot" />Visit Our Office</span>
                  <div className="aspect-[21/9] rounded-2xl bg-[#0A0719] border border-line flex flex-col items-center justify-center text-center p-6 photo p1">
                    <MapPin className="w-8 h-8 text-primary mb-2" />
                    <p className="text-white font-bold text-lg">PrimeHomeKanpur Office</p>
                    <p className="text-white/80 text-xs mt-1">Awadhpuri, Near Sales Tax Office, Kanpur – 208024, Uttar Pradesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Quick Help FAQ Links */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="pill mx-auto mb-4"><span className="dot" />Quick Help</span>
              <h2 className="mx-auto">Before you reach out — <span className="hl">maybe your answer is here</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                Here are the questions we get every single day. Click any of them to jump straight to our FAQ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  emoji: '💰',
                  q: 'What are your fees?',
                  a: 'Tenants pay 1 month rent (one-time). Landlords get free first 60 days listing →',
                },
                {
                  emoji: '🔍',
                  q: 'Are listings really verified?',
                  a: '100% verified. Every property is physically visited by our Head of Listings before going live →',
                },
                {
                  emoji: '📄',
                  q: 'Do you handle paperwork?',
                  a: 'Yes. Lease agreements drafted by property lawyers, free for all our clients →',
                },
                {
                  emoji: '🌏',
                  q: 'Which areas do you cover?',
                  a: '43+ Kanpur neighborhoods from Civil Lines to Barra. See the full list →',
                },
              ].map((item) => (
                <Link key={item.q} href="/faq" className="feat block hover:border-primary transition-colors">
                  <div className="text-2xl mb-3">{item.emoji}</div>
                  <h3 className="text-white font-bold text-base mb-2">{item.q}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{item.a}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
