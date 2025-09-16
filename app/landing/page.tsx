"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const LandingPage = dynamic(() => import('../../src/pages/LandingPage'), { ssr: false })

export default function LandingPageRoute() {
  return <LandingPage />
}
