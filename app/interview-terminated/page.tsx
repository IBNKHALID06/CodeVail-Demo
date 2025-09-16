"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type TerminationInfo = {
  violations?: string[];
  filteredViolations?: string[];
  threatLevel?: string;
  timestamp?: string;
};

export default function InterviewTerminatedPage() {
  const [info, setInfo] = useState<TerminationInfo | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const qp = new URLSearchParams(window.location.search).get('data');
        if (qp) {
          const decoded = JSON.parse(Buffer.from(decodeURIComponent(qp), 'base64').toString('utf-8'));
          const mapped: TerminationInfo = {
            filteredViolations: decoded.v || decoded.filteredViolations,
            threatLevel: decoded.tl || decoded.threatLevel,
            timestamp: decoded.ts ? new Date(decoded.ts).toISOString() : new Date().toISOString()
          };
          setInfo(mapped);
          try { localStorage.setItem('lastAntiCheatTermination', JSON.stringify(mapped)); } catch {}
        } else {
          // @ts-ignore
          const last = (window as any).__lastAntiCheatTermination as TerminationInfo | undefined;
          if (last) setInfo(last); else {
            try {
              const ls = localStorage.getItem('lastAntiCheatTermination');
              if (ls) setInfo(JSON.parse(ls));
            } catch {}
          }
        }
      } catch {}
    }
  }, []);

  const displayList = info?.filteredViolations?.length ? info.filteredViolations : info?.violations || [];

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-red-950 via-black to-red-950 text-red-50">
      <div className="w-full max-w-lg rounded-xl border border-red-600/70 bg-red-900/40 backdrop-blur-sm shadow-xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-red-200">Session Terminated</h1>
          <p className="text-sm text-red-200/80">Security policy violation detected. This test session has ended.</p>
        </div>

        <div className="rounded-md border border-red-500/60 bg-red-800/60 p-4 text-sm space-y-2">
          {displayList.length > 0 ? (
            <p>
              Violating application{displayList.length>1?'s':''}: <span className="font-medium">{displayList.join(', ')}</span>
            </p>
          ) : (
            <p className="text-xs opacity-80">No violation list captured (possible refresh).</p>
          )}
          {info?.threatLevel && (
            <p className="uppercase text-[10px] tracking-wide text-red-300/80">Threat level: {info.threatLevel}</p>
          )}
          {info?.timestamp && (
            <p className="text-[10px] opacity-70">Time: {info.timestamp}</p>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <p className="leading-relaxed text-red-100/90">
            Re-attempting while prohibited software is still open will lead to repeated terminations. Close all flagged applications before restarting.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex h-10 items-center justify-center rounded-md border border-red-500 bg-red-600 text-red-50 px-4 text-sm font-medium shadow hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
          >
            Return Home
          </Link>
          <Link
            href="/interview"
            prefetch={false}
            className="inline-flex h-9 items-center justify-center rounded-md border border-red-400/70 bg-red-400/20 text-red-200 px-4 text-xs font-medium hover:bg-red-400/30 transition"
          >
            Try Again (after fixing)
          </Link>
        </div>

        <p className="text-[10px] leading-snug text-red-200/60 text-center pt-4">
          If you believe this termination was an error, contact support with the timestamp shown above.
        </p>
      </div>
    </main>
  );
}
