"use client"
import { useParams } from "next/navigation"

export default function TechTest() {
  const params = useParams()
  const testId = params?.testId

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Tech Test
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Test ID: {testId}</p>
        <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
          This page will contain the coding environment with webcam recording.
        </p>
      </div>
    </div>
  )
}
