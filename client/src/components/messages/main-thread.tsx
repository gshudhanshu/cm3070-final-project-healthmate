// components/MessageThread.tsx
import React, { useState } from "react";
import { useMessagesStore } from "@/store/useMessageStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

import dayjs from "dayjs";

const MessageThread = ({ className }: { className?: string }) => {
  const { selectedContact } = useMessagesStore();
  const [newMessage, setNewMessage] = useState("");

  // Dummy messages
  const messages = [
    {
      id: 1,
      sender: "Mark Barton",
      recipient: "User",
      content: "Hello there!",
      timestamp: new Date(),
    },
    // ... more messages
  ];

  const sendMessage = () => {
    // Logic to send a new message
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.sender === selectedContact ||
      message.recipient === selectedContact,
  );

  return (
    <div
      className={cn(
        "flex h-full flex-grow flex-col justify-between bg-white",
        className,
      )}
    >
      <div>
        <div className="my-7 flex items-center gap-3">
          <ChevronLeftIcon className="w-6" />
          <h2 className="text-2xl font-medium">Mark Barton </h2>
          <span className="text-xs text-slate-600">
            {dayjs("2023-01-09 16:33:22 EST").format("DD MMM YY, HH:mm A")}
          </span>
        </div>
        <ScrollArea className="h-[50vh]">
          <div className="mt-4 flex space-y-2">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div key={message.id} className="p-2">
                  <div className="text-sm text-slate-500">{message.sender}</div>
                  <div className="text-slate-700">{message.content}</div>
                </div>
              ))
            ) : (
              <p>No messages to display</p>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Textarea placeholder="Type a message..." className="" />
        <div className="flex justify-between">
          <Input id="file" type="file" className="w-fit" />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
