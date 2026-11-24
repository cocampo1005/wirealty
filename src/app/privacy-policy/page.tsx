import { business } from '@/content/business'
import { showSampleContent } from '@/lib/site-mode'
import { pageMetadata } from '@/lib/seo/metadata'
import { PageHero } from '@/components/layout/page-hero'
import { SampleNotice } from '@/components/ui/sample-badge'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: `How ${business.name} collects, uses and protects information submitted through this website.`,
  path: '/privacy-policy',
})

/**
 * [DRAFT] General-purpose privacy policy describing how this website actually
 * behaves (contact forms, local-only favorites, no accounts). It has not been
 * reviewed by an attorney and must be approved before launch.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" size="compact" />

      <section className="bg-white section-y-sm">
        <div className="container-wi">
          <div className="mx-auto max-w-3xl">
            {showSampleContent ? (
              <SampleNotice className="mb-10">
                This policy is a draft that describes how the website works. It has not been reviewed by legal
                counsel and needs the brokerage’s approval (and an effective date) before launch.
              </SampleNotice>
            ) : null}

            <div className="prose-wi text-ink">
              <p className="text-lead">
                {business.name} (“we”, “us”) respects your privacy. This policy explains what information we
                collect through this website, how we use it, and the choices you have.
              </p>

              <h2>Information you provide</h2>
              <p>
                When you submit a contact, property inquiry or property management consultation form, we
                collect the details you enter — such as your name, email address, phone number, information
                about your property, and your message — together with the page you submitted the form from
                and, where relevant, the property you were viewing.
              </p>

              <h2>How we use your information</h2>
              <ul>
                <li>To respond to your inquiry and provide the services you request.</li>
                <li>To communicate with you about properties or services you have asked about.</li>
                <li>To maintain the security and proper operation of this website.</li>
              </ul>
              <p>We do not sell your personal information.</p>

              <h2>Saved properties and searches</h2>
              <p>
                This website does not offer user accounts. If you save a property or a search, that
                information is stored only in your own browser (using local storage) so the site can show it
                to you again on the same device. It is not sent to us, and you can remove it at any time by
                un-saving the items or clearing your browser’s site data.
              </p>

              <h2>Cookies and analytics</h2>
              <p>
                The website uses only the technical storage needed for it to function. If analytics or
                advertising tools are added in the future, this policy will be updated to describe them.
              </p>

              <h2>Service providers</h2>
              <p>
                We rely on trusted service providers to host this website and to deliver form submissions to
                us by email. These providers process information on our behalf and only as needed to provide
                their services.
              </p>

              <h2>Property listing information</h2>
              <p>
                Property information displayed on this website may be supplied by third parties, including
                multiple listing services, and is provided for consumers’ personal, non-commercial use. It
                is believed to be reliable but is not guaranteed and should be independently verified.
              </p>

              <h2>Your choices</h2>
              <p>
                You may ask us to update or delete the personal information you have submitted, or to stop
                contacting you, by emailing <a href={`mailto:${business.email}`}>{business.email}</a>.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                We may update this policy from time to time. Changes will be posted on this page.
              </p>

              <h2>Contact</h2>
              <p>
                Questions about this policy can be sent to{' '}
                <a href={`mailto:${business.email}`}>{business.email}</a> or by calling{' '}
                <a href={`tel:${business.phones[0].e164}`}>{business.phones[0].display}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
