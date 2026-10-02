import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-bg py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary mb-6">
              Last updated: October 2026
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-text-secondary mb-4">
              By accessing or using PrimeHomeKanpur, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our platform.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Use of Platform</h2>
            <p className="text-text-secondary mb-4">
              PrimeHomeKanpur is a rental property discovery platform. Users may browse listings, make inquiries, and connect with property owners and agents. All users must comply with applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Property Listings</h2>
            <p className="text-text-secondary mb-4">
              Property listings are provided for informational purposes only. While we strive to maintain accurate and up-to-date information, we do not guarantee the accuracy, completeness, or reliability of any listing.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">User Responsibilities</h2>
            <p className="text-text-secondary mb-4">
              Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. Users must not provide false or misleading information.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Fees and Payments</h2>
            <p className="text-text-secondary mb-4">
              PrimeHomeKanpur charges a brokerage fee for successful rental transactions. Specific fee structures are communicated during the inquiry process. All payments are subject to our refund policy.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-text-secondary mb-4">
              PrimeHomeKanpur shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our platform, to the maximum extent permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to Terms</h2>
            <p className="text-text-secondary mb-4">
              We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4">
              For questions about these Terms & Conditions, please contact us at pathak424448@gmail.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
