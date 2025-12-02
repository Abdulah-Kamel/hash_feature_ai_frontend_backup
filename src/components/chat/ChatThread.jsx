"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";

function ChatThread({ messages }) {
  const listRef = React.useRef(null);
  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <Card className="bg-background rounded-none h-full border-none py-2">
        <div ref={listRef} className="h-full overflow-auto px-4 py-4 space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} author={m.author} initials={m.initials} time={m.time} outgoing={m.outgoing}>
              {m.content}
            </ChatMessage>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ChatThread;