"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/messages/side-bar";
import MessageThread from "@/components/messages/main-thread";
import { Conversation, Message } from "@/types/conversation";
import { useMessagesStore } from "@/store/useMessageStore";
import { useWindowSize } from "@uidotdev/usehooks";

const MessagesPage: React.FC = () => {
  const { isSidebarVisible, toggleSidebar } = useMessagesStore();
  const size = useWindowSize();

  const isMobile = size?.width && size.width < 768;

  return (
    <div className="container flex w-full gap-6 px-0">
      {isMobile ? (
        isSidebarVisible ? (
          <Sidebar className="w-full px-6 pb-6" />
        ) : (
          <MessageThread className="w-full pb-10 pr-6" />
        )
      ) : (
        <>
          <Sidebar className="flex-shrink px-6 pb-6" />
          <MessageThread className="pb-10 pr-6" />
        </>
      )}
    </div>
  );

  return (
    <div className="container flex w-full gap-6 px-0">
      <Sidebar className="flex-shrink-1 w-full px-6 pb-6 md:max-w-80" />
      <MessageThread className={"hidden w-full flex-grow pb-10 pr-6 md:flex"} />
    </div>
  );
};

export default MessagesPage;
