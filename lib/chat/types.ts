export interface ChatCitation {
  label: string;
  source: string;
  historical?: boolean;
}

export interface ChatCaseRef {
  name: string;
  principle: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessageData {
  id: string;
  role: ChatRole;
  content: string;
  citations?: ChatCitation[];
  cases?: ChatCaseRef[];
  examTip?: string;
  followUps?: string[];
  subject?: string;
  createdAt: string;
  pending?: boolean;
  error?: boolean;
  /** User-safe error message to show instead of the generic fallback. Never a raw stack/API error. */
  errorMessage?: string;
}

export interface ChatApiRequest {
  question: string;
  chatHistory: { role: ChatRole; content: string }[];
  subject?: string;
  /** Existing conversation to append to. Omit to start (and persist) a new one. */
  conversationId?: string;
}

export interface ChatApiResponse {
  answer: string;
  subject: string;
  citations: ChatCitation[];
  cases: ChatCaseRef[];
  followUps: string[];
  examTip?: string;
  /** Set when the turn was persisted — the caller's new or existing conversation id. */
  conversationId?: string;
}
