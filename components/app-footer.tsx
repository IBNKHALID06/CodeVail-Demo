"use client"

import Link from 'next/link'

export default function AppFooter() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 mt-12 px-6 py-8 text-sm text-neutral-600 dark:text-neutral-400">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">CodeVail Demo</p>
          <p className="text-xs max-w-md leading-relaxed">This is a non-production demonstration environment. Do not enter real personal or confidential data. All activity may be logged for demo review.</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs items-center">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Home</Link>
          <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Terms</Link>
          <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Privacy</Link>
        </nav>
      </div>
      <div className="mt-6 text-[10px] uppercase tracking-wide opacity-60">© {new Date().getFullYear()} Demo Use Only</div>
    </footer>
  )
}
