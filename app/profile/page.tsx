"use client"

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const Profile = dynamic(() => import('../../src/pages/Profile'), { ssr: false })

export default function ProfilePage() {
  return <Profile />
}
