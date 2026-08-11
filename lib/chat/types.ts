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
}

export interface ChatApiRequest {
  question: string;
  chatHistory: { role: ChatRole; content: string }[];
  subject?: string;
}

export interface ChatApiResponse {
  answer: string;
  subject: string;
  citations: ChatCitation[];
  cases: ChatCaseRef[];
  followUps: string[];
  examTip?: string;
}
