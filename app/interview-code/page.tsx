"use client"

import dynamic from 'next/dynamic'

const InterviewCode = dynamic(() => import('../../app/interview-code'), { ssr: false })

export default function InterviewCodeRoute() {
  return <InterviewCode />
}
