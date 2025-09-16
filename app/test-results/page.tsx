"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const TestResults = dynamic(() => import('../../src/pages/TestResults'), { ssr: false })

export default function TestResultsPage() {
  return <TestResults />
}
