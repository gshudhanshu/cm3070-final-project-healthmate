// components/MessageThread.tsx
import React, { useEffect, useState } from "react";
import { useMessagesStore } from "@/store/useMessageStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useWindowSize } from "@uidotdev/usehooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import dayjs from "dayjs";
import { get } from "http";

const MessageThread = ({ className }: { className?: string }) => {
  const {
    selectedConversation,
    isSidebarVisible,
    toggleSidebar,
    getOppositeParticipant,
    messages,
    fetchMessages,
  } = useMessagesStore();
  const [newMessage, setNewMessage] = useState("");

  const size = useWindowSize();

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Dummy messages
  // const messages = [
  //   {
  //     id: 1,
  //     sender: "Mark Barton",
  //     recipient: "User",
  //     content: "Hello there!",
  //     timestamp: new Date(),
  //   },
  //   // ... more messages
  // ];

  const sendMessage = () => {
    // Logic to send a new message
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

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
          <h2 className="text-2xl font-medium">
            {!selectedConversation && "Select a conversation"}
            {selectedConversation &&
              getOppositeParticipant(selectedConversation)?.first_name +
                " " +
                getOppositeParticipant(selectedConversation)?.last_name}
          </h2>
          <span className="text-xs text-slate-600">
            {dayjs().format("DD MMM YY, HH:mm A")}
          </span>
        </div>
        <ScrollArea className="h-[50vh]">
          {/* Render messages here, align all messages on left side, timestamp on right side, and an avatar before message and name */}
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={message.sender.profile_pic ?? ""} />
                  <AvatarFallback>
                    {message.sender.first_name[0] + message.sender.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex w-full justify-between gap-2">
                    <span className="font-semibold capitalize">
                      {message.sender.first_name +
                        " " +
                        message.sender.last_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {dayjs(message.timestamp).format("HH:mm A")}
                    </span>
                  </div>
                  <p className="mt-1">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
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
