"use client";
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        router.back();
        return;
      }
    }
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Interview Results</h1>
        <button
          onClick={goBack}
          className="text-sm px-3 py-2 rounded border bg-background hover:bg-muted transition"
        >
          Back
        </button>
      </div>
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Below is a placeholder for candidate performance metrics, code submission summaries, and anti‑cheat signals.
          Integrate with your scoring pipeline to populate this view.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Score Overview</h2>
            <p className="text-sm text-muted-foreground">Coming soon: aggregated test case pass rate & complexity.</p>
          </div>
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Integrity Signals</h2>
            <p className="text-sm text-muted-foreground">No critical violations recorded in this placeholder.</p>
          </div>
          <div className="border rounded p-4 md:col-span-2">
            <h2 className="font-semibold mb-2">Submission History</h2>
            <p className="text-sm text-muted-foreground">Will list code iterations with timestamps.</p>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Link href="/dashboard" className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">
            Go to Dashboard
          </Link>
          <button
            onClick={goBack}
            className="px-4 py-2 rounded border text-sm hover:bg-muted transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
