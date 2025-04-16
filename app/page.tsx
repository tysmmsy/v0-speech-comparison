import { SpeechTabs } from "./components/tabs"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">音声合成アプリ</h1>
        <SpeechTabs />
      </div>
    </main>
  )
}
