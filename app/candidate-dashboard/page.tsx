"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const CandidateDashboard = dynamic(() => import('../../src/views/CandidateDashboard'), { ssr: false })

export default function CandidateDashboardPage() {
  return <CandidateDashboard />
}
