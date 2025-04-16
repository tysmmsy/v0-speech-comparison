export type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"

export interface SpeechSettings {
  text: string
  voice: Voice
}
