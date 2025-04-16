"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface AudioPlayerProps {
  audioData?: string
  mimeType?: string
  isDemoMode?: boolean
  demoMessage?: string
}

export function AudioPlayer({ audioData, mimeType = "audio/mpeg", isDemoMode = false, demoMessage }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioData && audioRef.current) {
      audioRef.current.src = `data:${mimeType};base64,${audioData}`
      audioRef.current.load()
    }
  }, [audioData, mimeType])

  const handlePlay = () => {
    audioRef.current?.play()
  }

  const handlePause = () => {
    audioRef.current?.pause()
  }

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  if (isDemoMode) {
    return (
      <div className="flex items-center justify-center h-16 bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-700 text-sm">
          {demoMessage || "デモモード: APIクォータ制限のため、実際の音声は生成されません"}
        </p>
      </div>
    )
  }

  if (!audioData) {
    return (
      <div className="flex items-center justify-center h-16 bg-gray-100 rounded-md">
        <p className="text-gray-500">音声が生成されていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <audio ref={audioRef} className="hidden" controls />
      <div className="flex items-center justify-center gap-2">
        <Button size="icon" variant="outline" onClick={handlePlay} title="再生">
          <Play className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={handlePause} title="一時停止">
          <Pause className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={handleReset} title="リセット">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
