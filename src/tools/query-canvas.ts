import { tool } from "ai";
import { z } from "zod";

export const queryCanvas = tool({
  description: `Read the current contents of the canvas.  Call this when you need to know about elements before using other tools like update, add, remove, etc. Returns a summary of all the elements including things like id, position, dimensions, groupIds etc.`,
  inputSchema: z.object({}),
});
