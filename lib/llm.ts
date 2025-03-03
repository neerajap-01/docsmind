import { ChatOpenAI } from "@langchain/openai";
import { env } from "./config";

export const streamingModel = new ChatOpenAI({
  model: env.OPENAI_MODEL,
  streaming: true,
  verbose: true,
  temperature: 0,
})

export const nonStreamingModel = new ChatOpenAI({
  model: env.OPENAI_MODEL,
  verbose: true,
  temperature: 0,
})