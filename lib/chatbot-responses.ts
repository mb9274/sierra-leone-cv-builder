export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function generateChatbotResponse(userMessage: string): string {
  const message = userMessage.trim()

  if (!message) {
    return "Send a question and I’ll help."
  }

  return `I can answer that better when Gemini is enabled. You asked: "${message}". If you want, I can still help with CVs, jobs, interviews, or app navigation once the API key is set.`
}
