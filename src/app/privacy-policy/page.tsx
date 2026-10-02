import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-bg py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary mb-6">
              Last updated: October 2026
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
            <p className="text-text-secondary mb-4">
              We collect information you provide directly to us, such as when you create an account, make an inquiry, or contact us. This may include your name, email address, phone number, and other personal information.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-text-secondary mb-4">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information Sharing</h2>
            <p className="text-text-secondary mb-4">
              We do not sell your personal information. We may share your information with property owners or agents when you make an inquiry, and with service providers who assist us in operating our platform.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Security</h2>
            <p className="text-text-secondary mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Your Rights</h2>
            <p className="text-text-secondary mb-4">
              You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications from us.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have any questions about this Privacy Policy, please contact us at primehomekanpur@gmail.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
