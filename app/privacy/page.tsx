"use client";
import React from 'react';

const LAST_UPDATED = 'September 2024';

export default function PrivacyPolicyPage() {
  return (
    <div className="prose dark:prose-invert max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {LAST_UPDATED}</p>
      <p>
        This Privacy Policy explains how CodeVail ("we", "us") collects, uses, and safeguards personal and assessment
        integrity data when you access the platform or participate in an assessment session.
      </p>
      <h2>1. Data Categories</h2>
      <ul>
        <li>Account & profile: name, email, role.</li>
        <li>Session telemetry: timestamps, navigation, coding events, performance metrics.</li>
        <li>Anti‑cheat signals: disallowed processes, window focus anomalies, environment flags.</li>
        <li>Device context: OS, basic hardware identifiers (non‑persistent), viewport traits.</li>
        <li>Content: code you write, prompts, interviewer notes, feedback.</li>
      </ul>
      <h2>2. Purpose of Processing</h2>
      <p>
        We process data to (a) deliver assessments, (b) detect fraud or policy violations, (c) improve reliability and
        security, (d) provide interviewer insights, and (e) satisfy legal obligations.
      </p>
      <h2>3. Legal Bases</h2>
      <p>
        Depending on jurisdiction: legitimate interest (assessment integrity & security), contract performance, and
        compliance with legal obligations. Where required, explicit consent is obtained for discrete monitoring steps.
      </p>
      <h2>4. Storage & Retention</h2>
      <p>
        Core assessment records are retained for the period mandated by the commissioning organization or applicable
        law, then minimized or anonymized. Volatile anti‑cheat process snapshots may be stored transiently only for
        fraud investigation.
      </p>
      <h2>5. Sharing</h2>
      <p>
        We share necessary data with: (i) the organization that scheduled your assessment; (ii) infrastructure or cloud
        security vendors bound by confidentiality; (iii) lawful authorities when required.
      </p>
      <h2>6. Security</h2>
      <p>
        We implement layered controls: least‑privilege services, encryption in transit, audit logging, anomaly
        detection, and segregation of sensitive telemetry. No system can guarantee absolute security.
      </p>
      <h2>7. Your Rights</h2>
      <p>
        Subject to law you may request access, correction, deletion, restriction, or export of applicable personal
        data. Certain anti‑cheat artifacts may be exempt where disclosure undermines integrity safeguards.
      </p>
      <h2>8. International Transfers</h2>
      <p>
        Where cross‑border transfer occurs we rely on appropriate safeguards such as standard contractual clauses or
        equivalent lawful mechanisms.
      </p>
      <h2>9. Updates</h2>
      <p>Material changes will be announced via in‑app notice or email where legally required.</p>
      <h2>10. Contact</h2>
      <p>Privacy inquiries: privacy@codevail.com</p>
      <p className="text-xs mt-10 opacity-70">
        This summary is not a substitute for any jurisdiction‑specific addendum provided to you. In case of conflict,
        the stricter policy or mandated notice controls.
      </p>
    </div>
  );
}
