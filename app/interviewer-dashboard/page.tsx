"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const InterviewerDashboard = dynamic(() => import('../../src/views/InterviewerDashboard'), { ssr: false })

export default function InterviewerDashboardPage() {
  return <InterviewerDashboard />
}
