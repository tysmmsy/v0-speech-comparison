"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpeechForm } from "./speech-form"
import { WebSpeechForm } from "./web-speech-form"

export function SpeechTabs() {
  return (
    <Tabs defaultValue="ai-sdk" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai-sdk">AI SDK</TabsTrigger>
        <TabsTrigger value="web-speech">Web Speech API</TabsTrigger>
      </TabsList>
      <TabsContent value="ai-sdk">
        <SpeechForm />
      </TabsContent>
      <TabsContent value="web-speech">
        <WebSpeechForm />
      </TabsContent>
    </Tabs>
  )
}
