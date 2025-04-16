"use server"

import { experimental_generateSpeech as generateSpeech } from "ai"
import { openai } from "@ai-sdk/openai"

// デモモードフラグ
let isInDemoMode = false

export async function generateSpeechFromText(text: string, voice = "alloy") {
  try {
    // APIキーのクォータ制限に達した場合はデモモードを有効にする
    if (isInDemoMode) {
      return handleDemoMode(text, voice)
    }

    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
      voice,
    })

    return { success: true, audioData: audio.base64, mimeType: audio.mimeType }
  } catch (error) {
    console.error("Speech generation error:", error)

    // クォータエラーを検出した場合、デモモードに切り替え
    if (error.toString().includes("quota") || error.toString().includes("billing")) {
      isInDemoMode = true
      return handleDemoMode(text, voice)
    }

    return {
      success: false,
      error: `エラーが発生しました: ${(error as Error).message}`,
      isDemoMode: false,
    }
  }
}

// デモモード処理関数
function handleDemoMode(text: string, voice: string) {
  // デモモードでは、テキストの長さに応じた「音声生成完了」メッセージを返す
  const textLength = text.length

  return {
    success: true,
    isDemoMode: true,
    demoText: text,
    demoVoice: voice,
    // デモモードでは実際の音声データは返さない
    audioData: null,
    mimeType: "audio/mpeg",
    message: `デモモード: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}" (${voice}音声) の生成をシミュレートしました。`,
  }
}
