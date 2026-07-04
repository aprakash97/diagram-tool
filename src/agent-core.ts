import {
  generateText,
  streamText,
  stepCountIs,
  type ModelMessage,
  type LanguageModel,
} from "ai";
import { SYSTEM_PROMPT } from "./system-prompt";
import { serializeCanvasState } from "./context/canvas-state";
import { buildTools } from "./tools";

interface AgentArgs {
  model: LanguageModel;
  messages: ModelMessage[];
  seedCanvas?: unknown[];
  system?: string;
  canvasState?: any[];
  maxSteps?: number;
  env?: {
    TAVILY_API_KEY?: string;
    UPSTASH_VECTOR_REST_URL?: string;
    UPSTASH_VECTOR_REST_TOKEN?: string;
  };
}

const buildSystemPrompt = (base: string, canvasState: any[]) => {
  return `${base}\n\n# Current Canvas state \n\n${serializeCanvasState(canvasState ?? [])}`;
};

export function streamAgent({
  model,
  messages,
  system = SYSTEM_PROMPT,
  maxSteps = 5,
  canvasState,
  env,
}: AgentArgs) {
  return streamText({
    model,
    system: buildSystemPrompt(system, canvasState ?? []),
    messages,
    tools: buildTools(env),
    stopWhen: stepCountIs(maxSteps),
  });
}

export async function runAgent({
  model,
  messages,
  system = SYSTEM_PROMPT,
  maxSteps = 5,
  env,
}) {
  const result = await generateText({
    model,
    system,
    messages,
    tools: buildTools(env),
    stopWhen: stepCountIs(maxSteps),
  });

  return {
    text: result.text,
    elements: extractElements(result.steps),
    maxSteps: result.steps,
  };
}

interface StepLike {
  toolResults?: {
    toolName: string;
    output: unknown;
  }[];
}

export function extractElements(steps: StepLike[]): unknown[] {
  const elements: unknown[] = [];
  for (const step of steps) {
    for (const toolResult of step.toolResults ?? []) {
      if (toolResult.toolName === "generateDiagram") {
        const output = toolResult.output as { elements?: unknown[] };
        if (Array.isArray(output?.elements)) elements.push(...output.elements);
      }
    }
  }
  return elements;
}
