import { NextRequest, NextResponse } from "next/server";
import { Message } from "ai";
import { fetchData } from "@/utils/fetchData";
import { CHATENPOINT, SERVER } from "@/ contants/endpoints.contants";

const formatMessage = (message: Message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${
    message.content
  }`;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: Message[] = body.messages ?? [];
  // console.log("Messages: ", messages);

  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const lastMessage = messages[messages.length - 1].content;

  // console.log("Chat history: ", formattedPreviousMessages.join("\n"));

  if(!lastMessage) {
    return NextResponse.json("Error: No question in the request body", {
      status: 400,
    });
  }

  try {
    const streamingTextResponse = await fetchData(
      SERVER,
      CHATENPOINT.chatLLM(),
      "post",
      {
        question: lastMessage,
        chat_history: formattedPreviousMessages.join("\n"),
      },
      {},
      {},
      false,
      true
    )
    return streamingTextResponse;
  } catch (error) {
    console.error("Internal Server Error: ", error);
    return NextResponse.json("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}