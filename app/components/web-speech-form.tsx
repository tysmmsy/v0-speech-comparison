"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { SampleTexts } from "./sample-texts"

interface Voice {
  name: string
  voiceURI: string
  lang: string
}
export function WebSpeechForm() {
  const [text, setText] = useState("")
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Web Speech APIのサポートチェックと音声リストの取得
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis

      // 音声リストを取得
      const loadVoices = () => {
        const availableVoices = synth.getVoices()
        if (availableVoices.length > 0) {
          setVoices(availableVoices)
          setSelectedVoice(availableVoices[0].voiceURI)
          setIsLoading(false)
        }
      }

      // 音声リストが既に利用可能な場合
      if (synth.getVoices().length > 0) {
        loadVoices()
      }

      // 音声リストが後から読み込まれる場合のイベントリスナー
      synth.onvoiceschanged = loadVoices

      // 発話状態の監視
      const checkSpeaking = setInterval(() => {
        setIsSpeaking(synth.speaking)
      }, 100)

      return () => {
        clearInterval(checkSpeaking)
        synth.cancel() // コンポーネントのアンマウント時に発話をキャンセル
      }
    } else {
      setIsSupported(false)
      setIsLoading(false)
    }
  }, [])

  const handleSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      const synth = window.speechSynthesis

      // 現在の発話をキャンセル
      synth.cancel()

      // 新しい発話を作成
      const utterance = new SpeechSynthesisUtterance(text)

      // 選択された音声を設定
      const voice = voices.find((v) => v.voiceURI === selectedVoice)
      if (voice) {
        utterance.voice = voice as SpeechSynthesisVoice
      }

      // その他のパラメータを設定
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      // 発話開始
      synth.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const handlePause = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis
      if (isSpeaking) {
        synth.pause()
      } else {
        synth.resume()
      }
    }
  }

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSelectSample = (sampleText: string) => {
    setText(sampleText)
  }

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Web Speech API</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-700" />
            <AlertDescription className="text-red-700">
              お使いのブラウザはWeb Speech APIをサポートしていません。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Web Speech API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p>音声データを読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Web Speech API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="web-speech-text">テキスト</Label>
          <Textarea
            id="web-speech-text"
            placeholder="音声に変換するテキストを入力してください"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          <div>
            <Label className="text-sm text-gray-500">サンプルテキスト:</Label>
            <SampleTexts onSelectSample={handleSelectSample} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice-select">音声</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="音声を選択" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rate-slider">速度: {rate.toFixed(1)}</Label>
          </div>
          <Slider
            id="rate-slider"
            min={0.1}
            max={2}
            step={0.1}
            value={[rate]}
            onValueChange={(values) => setRate(values[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pitch-slider">ピッチ: {pitch.toFixed(1)}</Label>
          </div>
          <Slider
            id="pitch-slider"
            min={0.1}
            max={2}
            step={0.1}
            value={[pitch]}
            onValueChange={(values) => setPitch(values[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="volume-slider">音量: {(volume * 100).toFixed(0)}%</Label>
            <Volume2 className="h-4 w-4" />
          </div>
          <Slider
            id="volume-slider"
            min={0}
            max={1}
            step={0.01}
            value={[volume]}
            onValueChange={(values) => setVolume(values[0])}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button onClick={handleSpeak} disabled={!text || isSpeaking}>
          <Play className="h-4 w-4 mr-2" />
          再生
        </Button>
        <Button onClick={handlePause} disabled={!isSpeaking}>
          <Pause className="h-4 w-4 mr-2" />
          {isSpeaking ? "一時停止" : "再開"}
        </Button>
        <Button onClick={handleStop} disabled={!isSpeaking} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          停止
        </Button>
      </CardFooter>
    </Card>
  )
}
