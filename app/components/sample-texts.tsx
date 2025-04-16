"use client"

import { Button } from "@/components/ui/button"

interface SampleTextsProps {
  onSelectSample: (text: string) => void
}

const samples = [
  {
    label: "こんにちは",
    text: "こんにちは、私はAIアシスタントです。お手伝いできることがあれば、お気軽にお申し付けください。",
  },
  {
    label: "英語サンプル",
    text: "Hello, I am an AI assistant. How can I help you today?",
  },
  {
    label: "長文サンプル",
    text: "音声合成技術は、テキストを人間の声に変換する技術です。この技術は、スクリーンリーダー、ナビゲーションシステム、バーチャルアシスタントなど、さまざまな用途に使用されています。最近の音声合成技術は非常に自然で、人間の声と区別がつかないほど高品質になっています。",
  },
]

export function SampleTexts({ onSelectSample }: SampleTextsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {samples.map((sample, index) => (
        <Button key={index} variant="outline" size="sm" onClick={() => onSelectSample(sample.text)}>
          {sample.label}
        </Button>
      ))}
    </div>
  )
}
