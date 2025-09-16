interface TimerProps {
  duration: number
}

export function Timer({ duration }: TimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600">
      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
      <div className="text-center">
        <div className="font-mono text-lg font-bold">{formatTime(duration)}</div>
        <div className="text-xs text-gray-400">Session Time</div>
      </div>
    </div>
  )
}
