"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Reports route changes to Electron main so monitoring can be armed/disarmed.
export default function RouteBridge() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && pathname !== lastSent.current) {
      lastSent.current = pathname;
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        try {
          (window as any).electronAPI.setCurrentRoute?.(pathname);
          // Removed legacy duplicate routeChanged emission to prevent double IPC
        } catch (e) {
          console.warn('[RouteBridge] Failed to send route', e);
        }
      }
    }
  }, [pathname]);

  return null;
}
