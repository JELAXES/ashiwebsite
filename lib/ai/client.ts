import Anthropic from "@anthropic-ai/sdk";

/**
 * Server-only Anthropic client. Never import this file from a Client Component —
 * ANTHROPIC_API_KEY must stay on the server.
 */
let cachedClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured on the server.");
  }
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey });
  }
  return cachedClient;
}

export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
