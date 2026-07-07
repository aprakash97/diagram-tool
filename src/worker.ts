import { DesignAgent } from "./agent";
import { routeAgentRequest } from "agents";

export { DesignAgent };

interface Env {
  DesignAgent: DurableObjectNamespace;
  OPENAI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 400 })
    );
  },
} satisfies ExportedHandler<Env>;