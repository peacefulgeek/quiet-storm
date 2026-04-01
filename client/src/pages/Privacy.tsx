import { SITE_CONFIG } from "@/lib/types";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description={`Privacy Policy for ${SITE_CONFIG.title}. Learn how we collect, use, and protect your information.`}
        canonical={`https://${SITE_CONFIG.domain}/privacy`}
        noIndex
      />

      <section className="section-sage py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-foreground leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-medium mb-3">What We Collect</h2>
            <p>
              If you subscribe to our newsletter, we collect your email address. That is the only personal data we collect. We do not collect names, phone numbers, payment information, or any other personal data. We do not use tracking cookies for advertising. We do not sell, rent, or share your email address with third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">How We Store It</h2>
            <p>
              Email addresses submitted through our newsletter form are stored as a simple text file on Bunny CDN, a content delivery network. There is no database. There is no user account system. Your email is stored in a secure, encrypted-at-rest storage zone and is accessible only to the site administrators.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Cookies</h2>
            <p>
              This site uses a single functional cookie to remember your cookie consent preference. We do not use analytics cookies, advertising cookies, or third-party tracking cookies. No Google Analytics. No Facebook Pixel. No tracking scripts of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Third-Party Services</h2>
            <p>
              We use Bunny CDN to serve images and store subscriber emails. Bunny CDN may collect standard server logs (IP address, browser type, pages visited) as part of normal CDN operations. We do not use any advertising networks or third-party analytics services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Affiliate Disclosure</h2>
            <p>
              As an Amazon Associate I earn from qualifying purchases.
            </p>
            <p className="mt-3">
              This site is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Some links on this site are affiliate links, meaning we may earn a small commission at no additional cost to you.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Your Rights</h2>
            <p>
              You may request deletion of your email address at any time. Under GDPR, CCPA, and similar regulations, you have the right to access, correct, or delete your personal data. Since we only store email addresses, deletion is straightforward and permanent.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Opt-Out</h2>
            <p>
              Since we do not send marketing emails or use tracking cookies, there is nothing to opt out of. If you have subscribed and wish to be removed, we will delete your email upon request.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Children's Privacy</h2>
            <p>
              This site is not directed at children under 13. We do not knowingly collect personal information from children.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
