"use client"

import { Suspense } from "react"
import CallPage from "../../../src/views/CallPage"

export default function NewCallRoute() {
  return (
    <Suspense fallback={null}>
      <CallPage />
    </Suspense>
  )
}
