"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const Analytics = dynamic(() => import('../../src/views/AnalyticsPage'), { ssr: false })

export default function AnalyticsPage() {
  return <Analytics />
}
