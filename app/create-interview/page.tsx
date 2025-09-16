"use client"

import dynamic from 'next/dynamic'

const CreateInterview = dynamic(() => import('../../app/create-interview'), { ssr: false })

export default function CreateInterviewRoute() {
  return <CreateInterview />
}
