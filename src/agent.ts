import { AIChatAgent } from "@cloudflare/ai-chat";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { tools } from "./tools";
import { createOpenAI } from "@ai-sdk/openai";

interface ENV {
  OPEN_AI_KEY: string;
}

//MORE LIKE BASELINE INFORMATION OF CONTEXT of the app
const SYSTEM_PROMPT = `You are a diagram design assistant. You help users create and modify diagrams on an Excalidraw canvas.
  
  Guidelines for generating diagrams:
    - Give each element a unique id (e.g. "rect-1", "text-1", "arrow-1")
    - Position elements with reasonable spacing (at least 20px gap between elements)
    - Use rectangles for boxes/containers, ellipses for circles, diamonds for decision points
    - Add text labels inside or near shapes
    - Connect related elements with arrows
    - Use a clean layout: left to right or top to bottom
    - Default to strokeColor "#1e1e1e" and backgroundColor "transparent"
    - Set roughness to 1 for a hand-drawn look`;

export class DesignAgent  extends AIChatAgent<ENV> {
  async onChatMessage() {
    const openai = createOpenAI({ apiKey: this.env.OPEN_AI_KEY });

    const result = streamText({
      model: openai("gpt-5.4-mini"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(this.messages),
      tools,
      stopWhen: stepCountIs(5),
      providerOptions: {
        openai: {
          strictJsonSchema: false,
        },
      },
    });
    return result.toUIMessageStreamResponse();
  }
}
