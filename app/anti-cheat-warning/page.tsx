"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Lightweight dynamic status (optional enhancement later to pull from electron via window.electronAPI)
type ViolationSummary = {
	processes?: string[];
	threatLevel?: string;
	reason?: string;
};

export default function AntiCheatWarningPage() {
	const [summary, setSummary] = useState<ViolationSummary | null>(null);
	const [countdown, setCountdown] = useState(0);

	// Attempt to pull last violation data if exposed on the window (non-fatal if missing)
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				// Decode from query param if present
				const qp = new URLSearchParams(window.location.search).get('data');
				if (qp) {
					const decoded = JSON.parse(Buffer.from(decodeURIComponent(qp), 'base64').toString('utf-8'));
					const mapped: ViolationSummary = { processes: decoded.processes || decoded.v, threatLevel: decoded.threatLevel || decoded.tl };
					setSummary(mapped);
					try { localStorage.setItem('lastAntiCheatWarning', JSON.stringify(mapped)); } catch {}
				} else {
					// @ts-ignore
					const last = (window as any).__lastAntiCheatViolation as ViolationSummary | undefined;
					if (last) setSummary(last);
					else {
						try {
							const ls = localStorage.getItem('lastAntiCheatWarning');
							if (ls) setSummary(JSON.parse(ls));
						} catch {}
					}
				}
				// countdown (if provided by global)
				// @ts-ignore
				const c = (window as any).__antiCheatRejoinCountdown as number | undefined;
				if (c && c > 0) setCountdown(c);
			} catch (e) { /* silent */ }
		}
	}, []);

	useEffect(() => {
		if (countdown > 0) {
			const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
			return () => clearInterval(t);
		}
	}, [countdown]);

	return (
		<main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-neutral-900 dark:to-neutral-900">
			<div className="w-full max-w-lg rounded-xl border border-yellow-400/60 bg-yellow-200/40 dark:bg-yellow-200/10 backdrop-blur-sm shadow-lg p-8 space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight text-yellow-800 dark:text-yellow-300">Integrity Warning</h1>
					<p className="text-sm text-yellow-900/80 dark:text-yellow-200/70">
						Disallowed software appears to be running. Resolve it before continuing the assessment.
					</p>
				</div>

				<div className="rounded-md border border-yellow-500/50 bg-yellow-100/70 dark:bg-yellow-500/10 p-4 text-sm space-y-2">
					{summary?.processes?.length ? (
						<p className="text-yellow-900 dark:text-yellow-200">
							Detected processes: <span className="font-medium">{summary.processes.join(', ')}</span>
						</p>
					) : (
						<p className="text-yellow-900 dark:text-yellow-300 text-xs">No detailed list captured (refresh or session reset).</p>
					)}
					{summary?.threatLevel && (
						<p className="uppercase text-[10px] tracking-wide text-yellow-700 dark:text-yellow-400">Threat level: {summary.threatLevel}</p>
					)}
				</div>

				<div className="space-y-3 text-sm text-yellow-900 dark:text-yellow-200">
					<p className="leading-relaxed">
						Close ALL of the listed applications (chat, remote control, screen share, AI helpers, unrelated browsers) before re-entering.
					</p>
					<ul className="list-disc ml-5 space-y-1 text-xs opacity-90">
						<li>Messaging / collaboration tools must remain closed.</li>
						<li>Large copy / paste may trigger additional review.</li>
						<li>Keep focus on the test window.</li>
					</ul>
				</div>

				<div className="flex flex-col gap-3 pt-2">
					<Link
							href="/"
							prefetch={false}
							className="inline-flex h-10 items-center justify-center rounded-md border border-yellow-600 bg-yellow-500 text-yellow-950 dark:bg-yellow-600 dark:text-yellow-50 px-4 text-sm font-medium shadow hover:brightness-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/60"
						>
							Return Home
						</Link>
					<Link
							href="/interview"
							prefetch={false}
							className="inline-flex h-9 items-center justify-center rounded-md border border-yellow-500/70 bg-yellow-300/70 dark:bg-yellow-500/20 text-yellow-900 dark:text-yellow-100 px-4 text-xs font-medium hover:bg-yellow-300 dark:hover:bg-yellow-500/30 transition"
						>
							Re-enter Interview (if allowed)
						</Link>
					{countdown > 0 && (
						<p className="text-center text-xs text-yellow-800 dark:text-yellow-300">You may retry in {countdown}s</p>
					)}
				</div>

				<p className="text-[10px] leading-snug text-yellow-800/70 dark:text-yellow-300/60 text-center pt-4">
					If you believe this is incorrect, contact support. All events are logged.
				</p>
			</div>
		</main>
	);
}

