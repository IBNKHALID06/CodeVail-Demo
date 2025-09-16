"use client";
import React from 'react';

const LAST_UPDATED = 'September 2024';

export default function TermsOfServicePage() {
  return (
    <div className="prose dark:prose-invert max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {LAST_UPDATED}</p>
      <p>
        These Terms of Service ("Terms") govern your access to and use of the CodeVail platform, including any desktop,
        web, mobile, or integrated assessment experiences (collectively, the "Service"). By accessing or using the
        Service you agree to be bound by these Terms. If you do not agree, you must not use the Service.
      </p>
      <h2>1. Eligibility & Accounts</h2>
      <p>
        You represent that you (a) are at least the age of majority in your jurisdiction, (b) have the right and
        authority to agree to these Terms, and (c) provided accurate registration information. You are responsible for
        safeguarding credentials and all activity under your account.
      </p>
      <h2>2. Acceptable Use</h2>
      <p>
        You will not: (i) circumvent security or anti‑cheat mechanisms; (ii) reverse engineer, decompile, or copy
        proprietary components; (iii) use the Service to infringe, harass, or transmit malicious code; (iv) share
        restricted assessment content; (v) access the Service using automated scraping tools without written consent.
      </p>
      <h2>3. Assessments & Anti‑Cheat</h2>
      <p>
        During monitored sessions you consent to local process inspection, environment integrity checks, and behavioral
        signals collection strictly for fraud, impersonation, or policy violation detection. Detected violations may
        result in immediate session termination and reporting to the commissioning organization.
      </p>
      <h2>4. Intellectual Property</h2>
      <p>
        All platform features, UX, anti‑cheat methodologies, analytics models, and related content are owned by
        CodeVail or its licensors. Limited, revocable, non‑transferable license is granted solely for legitimate
        assessment participation. All rights not expressly granted are reserved.
      </p>
      <h2>5. Confidentiality of Assessment Materials</h2>
      <p>
        Assessment prompts, test cases, scoring logic, and reviewer feedback are confidential. You agree not to retain,
        reproduce, photograph, publish, or redistribute any secure content.
      </p>
      <h2>6. Privacy</h2>
      <p>
        Use of the Service is also governed by our Privacy Policy describing categories of data, processing purposes,
        retention, and rights. By using the Service you acknowledge that monitoring necessary to preserve assessment
        integrity is a legitimate interest.
      </p>
      <h2>7. Suspension & Termination</h2>
      <p>
        We may suspend or terminate access for suspected policy breaches, fraud, security risk, or legal compliance.
        Upon termination your right to use the Service ceases immediately and we may preserve evidentiary logs as
        required.
      </p>
      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED, WE DISCLAIM ALL
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON‑INFRINGEMENT. WE DO NOT
        GUARANTEE UNINTERRUPTED OR ERROR‑FREE OPERATION.
      </p>
      <h2>9. Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT ALLOWED, IN NO EVENT WILL CODEVAIL OR LICENSORS BE LIABLE FOR INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR LOST PROFITS, DATA, OR GOODWILL. AGGREGATE LIABILITY
        WILL NOT EXCEED THE GREATER OF FEES PAID (IF ANY) OR USD $100.
      </p>
      <h2>10. Changes</h2>
      <p>
        We may revise these Terms by posting an updated version with a modified "Last updated" date. Continued use
        constitutes acceptance.
      </p>
      <h2>11. Contact</h2>
      <p>Questions: legal@codevail.com</p>
      <p className="text-xs mt-10 opacity-70">
        This page is provided for convenience. In case of conflict between these Terms and a separately executed
        written agreement, the latter governs.
      </p>
    </div>
  );
}
