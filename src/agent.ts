import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages, UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
interface ENV {
  OPEN_AI_KEY: string;
  TAVILY_API_KEY: string;
}
import { streamAgent } from "./agent-core";

// type CanvasStatePart = {
//   type: "data-canvas-state";
//   data: {
//     elements: any[];
//   };
// };

const isCanvasStatePart = (part: any): part is { type: "data-canvas-state"; data: { elements: any[] } } => {
  return part?.type === "data-canvas-state";
};

const extractCanvasState = (messages: UIMessage[]) => {
  const last = messages.at(-1);
  const part = last?.parts.find(isCanvasStatePart);
  return part?.data.elements ?? [];
};

export class DesignAgent extends AIChatAgent<ENV> {
  async onChatMessage() {
    const openai = createOpenAI({ apiKey: this.env.OPEN_AI_KEY });
    const canvasState = extractCanvasState(this.messages);
    const result = streamAgent({
      model: openai("gpt-5.4-mini"),
      messages: await convertToModelMessages(this.messages),
      canvasState,
      env: { TAVILY_API_KEY: this.env.TAVILY_API_KEY },
    });
    return result.toUIMessageStreamResponse();
  }
}
