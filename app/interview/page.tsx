"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const TechInterviewPage = dynamic(() => import('../../src/pages/TechInterviewPage'), { ssr: false })

export default function TechInterviewRoute() {
  return <TechInterviewPage />
}
