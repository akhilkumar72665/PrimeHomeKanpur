import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-bg py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary mb-6">
              Last updated: October 2026
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">What Are Cookies</h2>
            <p className="text-text-secondary mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Cookies</h2>
            <p className="text-text-secondary mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
              <li>Remember your login details and preferences</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve our website's functionality and user experience</li>
              <li>Provide personalized content and recommendations</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Types of Cookies We Use</h2>
            <p className="text-text-secondary mb-4">
              <strong>Essential Cookies:</strong> Required for the website to function properly.
            </p>
            <p className="text-text-secondary mb-4">
              <strong>Analytics Cookies:</strong> Help us understand how visitors use our website.
            </p>
            <p className="text-text-secondary mb-4">
              <strong>Preference Cookies:</strong> Remember your settings and preferences.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Managing Cookies</h2>
            <p className="text-text-secondary mb-4">
              You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Third-Party Cookies</h2>
            <p className="text-text-secondary mb-4">
              We may use third-party services that use cookies, such as analytics tools and social media plugins. These third parties have their own privacy policies governing the use of cookies.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have any questions about our use of cookies, please contact us at pathak424448@gmail.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
