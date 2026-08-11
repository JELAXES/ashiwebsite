import { GoogleGenAI } from "@google/genai";

/**
 * Server-only Gemini client. Never import this file from a Client Component —
 * GEMINI_API_KEY must stay on the server.
 */
let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
