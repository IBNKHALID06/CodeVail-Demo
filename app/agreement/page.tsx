"use client";
import React from 'react';
import Link from 'next/link';

export default function UserAgreementPage() {
  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">User Agreement</h1>
      <p>
        By proceeding you acknowledge and agree that monitored assessment sessions may collect environment and
        behavioral integrity signals strictly for anti‑cheat purposes as outlined in our{' '}
        <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> and{' '}
        <Link href="/terms" className="text-primary underline">Terms of Service</Link>.
      </p>
      <p>
        You certify that the work you submit represents your own unaided effort unless collaboration is explicitly
        allowed. Any attempt to exfiltrate questions, solicit unauthorized help, or mask prohibited tools can lead to
        immediate termination and disqualification.
      </p>
      <p className="text-sm italic">
        If you do not agree, do not continue. Closing this window or navigating away will abort participation.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="px-4 py-2 rounded bg-muted hover:bg-muted/70 transition">Cancel</Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Accept & Continue
        </Link>
      </div>
      <p className="text-xs mt-10 opacity-70">Version 1.0</p>
    </div>
  );
}
