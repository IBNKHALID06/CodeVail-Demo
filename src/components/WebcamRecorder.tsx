"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Camera, CameraOff, AlertCircle } from "lucide-react"

interface WebcamRecorderProps {
  isRecording: boolean
  onRecordingStart: () => void
  onRecordingStop: (blob: Blob) => void
  onError: (error: string) => void
  className?: string
}

export function WebcamRecorder({
  isRecording,
  onRecordingStart,
  onRecordingStop,
  onError,
  className = "",
}: WebcamRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [isStreamActive, setIsStreamActive] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<boolean>(false)

  const startStream = useCallback(async () => {
    if (pendingRef.current || streamRef.current) return
    pendingRef.current = true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsStreamActive(true)
      setHasPermission(true)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to access camera"
      setError(errorMessage)
      setHasPermission(false)
      onError(errorMessage)
    }
    finally {
      pendingRef.current = false
    }
  }, [onError])

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsStreamActive(false)
  }, [])

  const startRecording = useCallback(() => {
    if (!streamRef.current) {
      onError("No active stream to record")
      return
    }

    try {
      chunksRef.current = []
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      })

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        onRecordingStop(blob)
        chunksRef.current = []
      }

      mediaRecorderRef.current.start(1000) // Record in 1-second chunks
      onRecordingStart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start recording"
      setError(errorMessage)
      onError(errorMessage)
    }
  }, [onRecordingStart, onRecordingStop, onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }, [])

  // Initialize stream on mount
  useEffect(() => {
    let cancelled = false
    const kick = async () => {
      await Promise.resolve()
      if (!cancelled) startStream()
    }
    kick()
    return () => {
      cancelled = true
      stopStream()
    }
  }, [startStream, stopStream])

  // Handle recording state changes
  useEffect(() => {
    if (isRecording && isStreamActive) {
      startRecording()
    } else if (!isRecording && mediaRecorderRef.current?.state === "recording") {
      stopRecording()
    }
  }, [isRecording, isStreamActive, startRecording, stopRecording])

  if (hasPermission === false) {
    return (
      <div className={`webcam-container ${className} flex items-center justify-center p-4`}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2 text-error" size={32} />
          <p className="text-sm text-secondary mb-2">Camera access denied</p>
          <button onClick={startStream} className="btn-secondary text-xs">
            <Camera size={14} />
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`webcam-container ${className} flex items-center justify-center p-4`}>
        <div className="text-center">
          <CameraOff className="mx-auto mb-2 text-error" size={32} />
          <p className="text-xs text-secondary mb-2">{error}</p>
          <button onClick={startStream} className="btn-secondary text-xs">
            <Camera size={14} />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`webcam-container ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="webcam-video"
        style={{ transform: "scaleX(-1)" }} // Mirror effect
      />

      {isRecording && (
        <>
          <div className="webcam-overlay" />
          <div className="recording-indicator">
            <div className="recording-dot" />
            REC
          </div>
        </>
      )}

      {!isStreamActive && hasPermission === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-tertiary">
          <div className="spinner" />
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex gap-2">
        <div
          className={`w-3 h-3 rounded-full ${isStreamActive ? "bg-success animate-pulse" : "bg-error"}`}
          title={isStreamActive ? "Camera active" : "Camera inactive"}
        />
        {isRecording && <div className="w-3 h-3 rounded-full bg-error animate-pulse" title="Recording active" />}
      </div>
    </div>
  )
}
