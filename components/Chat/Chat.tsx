"use client";

import { scrollToBottom, initialMessages, getSources } from "@/utils/core.utils";
import React, { useEffect, useRef } from "react";
import { ChatLine } from "../ChatBubble/chat-line";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Message, useChat } from "@ai-sdk/react";

export function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit, status, data } = useChat({
    initialMessages
  });

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef as React.RefObject<HTMLElement>), 100);
  }, [messages]);

  return (
    <div className="rounded-2xl border h-[75vh] flex flex-col justify-between">
      <div className="p-6 overflow-auto" ref={containerRef as React.Ref<HTMLDivElement>}>
        {messages.map(({ id, role, content }: Message, index: number) => (
          <ChatLine
            key={id}
            role={role}
            content={content}
            sources={data?.length ? getSources(data, role, index) : []}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex clear-both">
        <Input
          value={input}
          placeholder={"Type to chat with AI..."}
          onChange={handleInputChange}
          className="mr-2"
        />

        <Button type="submit" className="w-24">
          {status === "streaming" ? <Spinner /> : "Ask"}
        </Button>
      </form>
    </div>
  );
}