"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const Login = dynamic(() => import('../../src/views/Login'), { ssr: false })

export default function LoginPage() {
  return <Login />
}
