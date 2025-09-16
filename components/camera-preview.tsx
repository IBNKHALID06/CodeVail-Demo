"use client"

import React, { useEffect, useRef, useState } from "react"

export function CameraPreview({
  className = "",
  constraints = { video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } }, audio: true },
}: {
  className?: string
  constraints?: MediaStreamConstraints
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let current: MediaStream | null = null
    const start = async () => {
      try {
        current = await navigator.mediaDevices.getUserMedia(constraints)
        if (!mounted) {
          current.getTracks().forEach(t => t.stop())
          return
        }
        setStream(current)
        if (videoRef.current) videoRef.current.srcObject = current
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to access camera")
      }
    }
    start()
    return () => {
      mounted = false
      if (current) current.getTracks().forEach(t => t.stop())
    }
  }, [constraints])

  if (error) {
    return <div className={`flex items-center justify-center ${className}`}>Camera error: {error}</div>
  }

  return <video ref={videoRef} autoPlay playsInline muted className={className} />
}
