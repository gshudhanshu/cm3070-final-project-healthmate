"use client";

import React, { useState } from "react";
import Sidebar from "@/components/messages/side-bar";
import MessageThread from "@/components/messages/main-thread";
import { Conversation, Message } from "@/types/conversation";

const MessagesPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Dummy data for conversations and messages

  const conversations: Conversation[] = [
    /* ... */
  ];
  const messages: Message[] = [
    /* ... */
  ];

  const handleSelectConversation = (conversationId: number) => {
    // Implement selection logic
  };

  const handleSendMessage = (content: string) => {
    // Implement send message logic
  };

  return (
    <div className="container flex w-full gap-6 px-0">
      <Sidebar className="w-full px-6 pb-6" />
      <MessageThread
        className={`${showSidebar ? "flex" : "hidden"} pb-10 pr-6`}
      />
    </div>
  );
};

export default MessagesPage;
