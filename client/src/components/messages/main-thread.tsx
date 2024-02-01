// components/MessageThread.tsx
import React, { useState } from "react";
import { useMessagesStore } from "@/store/useMessageStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useWindowSize } from "@uidotdev/usehooks";

import dayjs from "dayjs";

const MessageThread = ({ className }: { className?: string }) => {
  const { selectedContact, isSidebarVisible, toggleSidebar } =
    useMessagesStore();
  const [newMessage, setNewMessage] = useState("");

  const size = useWindowSize();

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

  // Determine if we are in a mobile view
  const isMobile = size?.width && size.width < 768;

  return (
    <div
      className={cn(
        "flex h-full flex-grow flex-col justify-between bg-white",
        className,
      )}
    >
      <div>
        <div className="my-7 flex items-center gap-3">
          {isMobile && !isSidebarVisible && (
            <ChevronLeftIcon
              className="h-6 w-6 cursor-pointer"
              onClick={toggleSidebar}
            />
          )}
          <h2 className="text-2xl font-medium">{selectedContact}</h2>
          <span className="text-xs text-slate-600">
            {dayjs().format("DD MMM YY, HH:mm A")}
          </span>
        </div>
        <ScrollArea className="h-[50vh]">
          {/* ... existing message display code ... */}
        </ScrollArea>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <div className="flex justify-between">
          <Input id="file" type="file" className="w-fit" />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
