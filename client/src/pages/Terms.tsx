import { SITE_CONFIG } from "@/lib/types";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <SEO
        title="Terms of Service"
        description={`Terms of Service for ${SITE_CONFIG.title}. Educational content, intellectual property, and liability information.`}
        canonical={`https://${SITE_CONFIG.domain}/terms`}
        noIndex
      />

      <section className="section-sage py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="space-y-8 text-foreground leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Educational Purpose</h2>
            <p>
              All content published on {SITE_CONFIG.title} is for educational and informational purposes only. Nothing on this site constitutes professional medical advice, psychiatric diagnosis, psychological treatment, or therapeutic intervention. Always consult a qualified healthcare provider before making changes to your health regimen, medication, or treatment plan.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Not a Substitute for Professional Care</h2>
            <p>
              If you are experiencing a mental health crisis, suicidal thoughts, or severe anxiety, please contact a mental health professional immediately. In the United States, you can reach the 988 Suicide &amp; Crisis Lifeline by calling or texting 988. This site is not equipped to provide emergency mental health services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Intellectual Property</h2>
            <p>
              All articles, images, and original content on this site are the intellectual property of {SITE_CONFIG.title} and its contributors. You may share links to articles freely. You may not reproduce, republish, or redistribute full articles without written permission. Brief quotations with attribution and a link back to the original article are permitted under fair use.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Limitation of Liability</h2>
            <p>
              {SITE_CONFIG.title}, its editors, contributors, and advisors shall not be held liable for any damages, direct or indirect, arising from the use of information published on this site. You use this site and its content at your own risk. We make reasonable efforts to ensure accuracy but do not guarantee that all information is current, complete, or error-free.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">External Links</h2>
            <p>
              This site contains links to external websites and resources. We are not responsible for the content, accuracy, or privacy practices of external sites. Inclusion of a link does not imply endorsement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium mb-3">Changes to These Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the revised terms.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
