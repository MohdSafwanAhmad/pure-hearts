export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-10">Last Updated: Sept 12, 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            These Terms & Conditions govern your use of the website,
            applications, and services operated by <strong>Pure Hearts</strong>.
            By using our platform, you agree to comply with these terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. Eligibility</h2>
          <p>
            You must be at least 18 years old or have parental/guardian consent
            to use our services. By using our platform, you confirm that you
            meet these requirements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Provide accurate and truthful information during registration.
            </li>
            <li>Maintain the confidentiality of your account credentials.</li>
            <li>
              Refrain from misusing the platform or engaging in unlawful
              activity.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Donations and Payments</h2>
          <p>
            All donations or payments are voluntary and non-refundable unless
            otherwise required by law. We reserve the right to decline or refund
            any transaction at our discretion.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
          <p>
            All content, trademarks, and designs on this platform are the
            property of
            <strong> Pure Hearts</strong> and may not be copied, reproduced, or
            distributed without written permission.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
          <p>
            We are not responsible for any indirect, incidental, or
            consequential damages resulting from your use of the platform,
            except where prohibited by law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Governing Law</h2>
          <p>
            These Terms are governed by the laws of <strong>Canada</strong>. Any
            disputes shall be resolved in the courts of <strong>Quebec</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
          <p>
            We may revise these Terms from time to time. Continued use of the
            platform after updates constitutes acceptance of the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">9. Contact</h2>
          <p>
            For questions about these Terms, please contact us at:{" "}
            <a
              href="mailto:pure.heart.platform@gmail.com"
              className="text-blue-600 underline"
            >
              pure.heart.platform@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
