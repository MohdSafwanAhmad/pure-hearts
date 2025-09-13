"use client"

import React from "react"

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last Updated: Sept 12, 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            This Privacy Policy explains how <strong>Pure Hearts</strong> collects,
            uses, and protects your personal information when you use our website,
            applications, or services. We are committed to safeguarding your privacy and
            ensuring transparency in how your data is handled.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Age and gender (optional)</li>
            <li>Other information you choose to provide</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. How We Collect Information</h2>
          <p>
            We collect information directly from you when you register, donate, subscribe
            to updates, or otherwise interact with our platform. We do not collect data
            from third parties without your consent.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Use of Information</h2>
          <p>We may use your personal information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Complete registrations and transactions</li>
            <li>Send confirmations, updates, and impact reports</li>
            <li>Improve user experience and personalize content</li>
            <li>Communicate important service or policy changes</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. Data Storage and Security</h2>
          <p>
            We store your personal data securely and take reasonable measures to protect
            it from unauthorized access, alteration, disclosure, or destruction. Data is
            retained only as long as necessary for the purposes outlined in this policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or request deletion of your personal
            data. You may also withdraw consent to data processing at any time, subject to
            legal or contractual restrictions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Sharing of Information</h2>
          <p>
            We do not sell or share your personal information with third parties except as
            required by law or with your explicit consent.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make changes, we
            will revise the “Last Updated” date above and notify you where appropriate.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact
            us at:{" "}
            <a href="mailto:pureheartsgives@gmail.com" className="text-blue-600 underline">
              pureheartsgives@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}