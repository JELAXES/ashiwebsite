import { Schema, model, models, Types, type Model, type InferSchemaType } from "mongoose";

const citationSchema = new Schema(
  {
    label: { type: String, required: true },
    source: { type: String, required: true },
    historical: Boolean,
  },
  { _id: false },
);

const caseRefSchema = new Schema(
  {
    name: { type: String, required: true },
    principle: { type: String, required: true },
  },
  { _id: false },
);

const messageSchema = new Schema(
  {
    id: { type: String, required: true, default: () => new Types.ObjectId().toString() },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    citations: { type: [citationSchema], default: undefined },
    cases: { type: [caseRefSchema], default: undefined },
    followUps: { type: [String], default: undefined },
    examTip: String,
    subject: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const conversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    subject: { type: String, default: "general" },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

export type ConversationDocument = InferSchemaType<typeof conversationSchema>;

export const Conversation =
  (models.Conversation as Model<ConversationDocument>) ?? model<ConversationDocument>("Conversation", conversationSchema);
