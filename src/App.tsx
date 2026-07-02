import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import Canvas from "./components/Canvas";
import "./App.css";
import ChatPanel from "./components/chat/ChatPanel";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";
import {
  CaptureUpdateAction,
  convertToExcalidrawElements,
  newElementWith,
} from "@excalidraw/excalidraw";
import { serializeCanvasState } from "./context/canvas-state";

const sessionId = crypto.randomUUID();

function stripNulls(obj: any) {
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null) {
      out[k] = v;
    }
  }
  return out;
}

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // const appliedToolCalls = useRef(new Set());
  const handleApiReady = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
  }, []);

  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  useEffect(() => {
    excalidrawAPIRef.current = excalidrawAPI;
  }, [excalidrawAPI]);
  const agent = useAgent({ agent: "design-agent", name: sessionId });
  const { messages, sendMessage, status } = useAgentChat({
    agent,
    onToolCall: async ({ toolCall, addToolOutput }) => {
      const api = excalidrawAPIRef.current;
      if (!api) {
        addToolOutput({
          toolCallId: toolCall.toolCallId,
          output: {
            error:
              "canvas not ready, Let the user know to try again in few seconds.",
          },
        });
        return;
      }

      if (toolCall.toolName === "queryCanvas") {
        addToolOutput({
          toolCallId: toolCall.toolCallId,
          output: {
            summary: serializeCanvasState(api.getSceneElements() as any),
          },
        });
        return;
      }

      if (toolCall.toolName === "addElements") {
        const { elements } = toolCall.input as any;

        console.log(elements);
        const cleaned = elements.map(stripNulls);

        const newOnes = convertToExcalidrawElements(cleaned, {
          regenerateIds: false,
        });

        const next = [...api.getSceneElements(), ...newOnes];
        api.updateScene({
          elements: next,
          captureUpdate: CaptureUpdateAction.IMMEDIATELY,
        });
        api.scrollToContent(next, { fitToContent: true });
        addToolOutput({
          toolCallId: toolCall.toolCallId,
          output: {
            added: newOnes.length,
          },
        });
        return;
      }

      if (toolCall.toolName === "updateElements") {
        // const { updates } = toolCall.input as any;
        // const byId = new Map((updates: any) => [
        //   updates.id,
        //   stripNulls(updates.fields),
        // ]);

        const { updates } = toolCall.input as {
          updates: {
            id: string;
            fields: Record<string, unknown>;
          }[];
        };

        const byId = new Map(
          updates.map(({ id, fields }) => [id, stripNulls(fields)]),
        );

        const next = api.getSceneElements().map((el) => {
          const fields = byId.get(el.id);
          return fields && Object.keys(fields).length > 0
            ? newElementWith(el, fields)
            : el;
        });

        api.updateScene({
          elements: next,
          captureUpdate: CaptureUpdateAction.IMMEDIATELY,
        });

        return;
      }

      if (toolCall.toolName === "removeElements") {
        const { ids } = toolCall.input as any;
        const remove = new Set(ids);
        const next = api.getSceneElements().filter((el) => !remove.has(el.id));
        api.updateScene({
          elements: next,
          captureUpdate: CaptureUpdateAction.IMMEDIATELY,
        });
        addToolOutput({
          toolCallId: toolCall.toolCallId,
          output: {
            removed: remove.size,
          },
        });

        return;
      }
    },
  });

  const sendWithCanvas = useMemo(
    () =>
      (msg: {
        role: "user";
        parts: {
          type: "text";
          text: string;
        }[];
      }) => {
        const elements = excalidrawAPI?.getSceneElements() ?? [];

        sendMessage({
          ...msg,
          parts: [
            ...msg.parts,
            {
              type: "data-canvas-state",
              data: { elements },
            },
          ],
        });
      },
    [sendMessage, excalidrawAPI],
  );

  return (
    <div className={`app ${theme}`}>
      <div className="canvas-container">
        <Canvas onApiReady={handleApiReady} onThemeChange={setTheme} />
      </div>
      <ChatPanel
        messages={messages}
        sendMessage={sendWithCanvas}
        status={status}
      />
    </div>
  );
}
