"use client"

import { useEffect, useRef } from 'react'

// NOTE: This component previously auto-started monitoring as soon as it mounted.
// With explicit lifecycle control + grace period, we now disable automatic test start
// to avoid premature activation on dashboards/login pages. It will only prepare a session
// (no markTestStarted) IF an opt-in flag is present (e.g., window.__ENABLE_ANTI_CHEAT_AUTOSTART === true).
// Prefer calling the exposed preload APIs directly from the actual test start UI instead.
export default function AntiCheatAutostart() {
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    if (typeof window === 'undefined') return
    // Only run inside Electron (renderer with preload exposing electronAPI)
    const api = (window as any).electronAPI
    if (!api) return

    // Only proceed if an explicit global flag enables this legacy behavior
    if (!(window as any).__ENABLE_ANTI_CHEAT_AUTOSTART) return;
    startedRef.current = true;
    try {
      api.resetAntiCheat?.();
      const interviewId = 'ui-' + Date.now();
      api.startAntiCheatSessionWith?.('LiveCandidate', interviewId, { role: 'candidate', testStarted: false });
      api.setUserRole?.('candidate');
      console.log('[AntiCheat][UI] Prepared anti-cheat session (awaiting explicit markTestStarted)');
    } catch (e: any) {
      console.error('[AntiCheat][UI] Autostart preparation failed:', e?.message || e);
    }
  }, [])

  return null
}
