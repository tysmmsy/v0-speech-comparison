"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateSpeechFromText } from "../actions"
import { AudioPlayer } from "./audio-player"
import type { Voice } from "../types"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SampleTexts } from "./sample-texts"

export function SpeechForm() {
  const [text, setText] = useState("")
  const [voice, setVoice] = useState<Voice>("alloy")
  const [audioData, setAudioData] = useState<string | undefined>()
  const [mimeType, setMimeType] = useState<string | undefined>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoMessage, setDemoMessage] = useState<string | undefined>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateSpeechFromText(text, voice)

      if (result.success) {
        setAudioData(result.audioData)
        setMimeType(result.mimeType)

        // デモモードの処理
        if (result.isDemoMode) {
          setIsDemoMode(true)
          setDemoMessage(result.message)
        } else {
          setIsDemoMode(false)
        }
      } else {
        setError(result.error || "音声の生成に失敗しました")
      }
    } catch (err) {
      setError("エラーが発生しました")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectSample = (sampleText: string) => {
    setText(sampleText)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>AI SDK</CardTitle>
      </CardHeader>
      <CardContent>
        {isDemoMode && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-700" />
            <AlertDescription className="text-yellow-700">
              OpenAI APIのクォータ制限に達したため、デモモードで動作しています。実際の音声は生成されません。
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">テキスト</Label>
            <Textarea
              id="text"
              placeholder="音声に変換するテキストを入力してください"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
            />
            <div>
              <Label className="text-sm text-gray-500">サンプルテキスト:</Label>
              <SampleTexts onSelectSample={handleSelectSample} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>音声</Label>
            <RadioGroup value={voice} onValueChange={(v) => setVoice(v as Voice)} className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alloy" id="alloy" />
                <Label htmlFor="alloy">Alloy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="echo" id="echo" />
                <Label htmlFor="echo">Echo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fable" id="fable" />
                <Label htmlFor="fable">Fable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onyx" id="onyx" />
                <Label htmlFor="onyx">Onyx</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nova" id="nova" />
                <Label htmlFor="nova">Nova</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shimmer" id="shimmer" />
                <Label htmlFor="shimmer">Shimmer</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" disabled={isGenerating || !text.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              "音声を生成"
            )}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <AudioPlayer audioData={audioData} mimeType={mimeType} isDemoMode={isDemoMode} demoMessage={demoMessage} />
      </CardFooter>
    </Card>
  )
}
