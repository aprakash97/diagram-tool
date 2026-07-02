import { tool } from "ai";
import { z } from "zod";
import { elementSchema } from "./element-schema";

export const addElements = tool({
  inputSchema: z.object({
    elements: z.array(elementSchema),
  }),
  description: `Add new elements to the canvas.  Each new element needs and id, type, position and size.
    Example: addElements({
        elements: [
            { type: "rectangle", id: "rect_start", x: 100, y: 100, width: 200, height: 80, label: { text: "Start" } },
            { type: "rectangle", id: "rect_end",   x: 380, y: 100, width: 200, height: 80, label: { text: "End" } },
            { type: "arrow", id: "arrow_start_end", x: 300, y: 140, width: 80, height: 0, start: { id: "rect_start" }, end: { id: "rect_end" } }
        ]
    })`,
  strict: true,
});
