"use client";

// components/MessageThread.tsx
import React, { useEffect, useRef, useState } from "react";
import { useMessagesStore } from "@/store/useMessageStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { useWindowSize } from "@uidotdev/usehooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import IncomingCallDrawer from "@/components/messages/incoming-call-drawer";
import { useCallStore } from "@/store/useCallStore";

import dayjs from "dayjs";
import { PhoneIcon } from "lucide-react";

const MessageThread = ({ className }: { className?: string }) => {
  const {
    selectedConversation,
    isSidebarVisible,
    toggleSidebar,
    getOppositeParticipant,
    messages,
    fetchMessages,
    sendMessage,
    connectWebSocket,
    disconnectWebSocket,
    sendCallMessage,
  } = useMessagesStore();
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const size = useWindowSize();
  // Ref for the bottom of the message list and file input
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { initiateCall } = useCallStore();

  useEffect(() => {
    // Fetch messages and connect WebSocket when a conversation is selected
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      connectWebSocket();
      return () => disconnectWebSocket();
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to the bottom every time messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (selectedConversation) {
      sendMessage(selectedConversation.id, newMessage, files);
      setNewMessage("");
      setFiles([]);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleInitiateCall = async () => {
    if (selectedConversation) {
      await initiateCall(selectedConversation.id);
      const callData = useCallStore.getState().callData;
      const callWindow = window.open(
        `/dashboard/messages/call?callId=${callData.id}&conversationId=${selectedConversation.id}`,
        "callWindow",
        "width=800,height=600",
      );
      if (callWindow) {
        const callState = useCallStore.getState();
        sendCallMessage(selectedConversation.id, callState);
        // const messageState = useMessagesStore.getState();
        // callWindow.callState = callState;
        // callWindow.messageState = messageState;
      }
    }
  };

  // Determine if we are in a mobile view
  const isMobile = size?.width && size.width < 768;

  return (
    <div
      className={cn(
        "flex h-full flex-grow flex-col justify-between bg-white dark:bg-black",
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
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {dayjs().format("DD MMM YY, HH:mm A")}
          </span>
          {selectedConversation && (
            <>
              <Button onClick={handleInitiateCall}>Call</Button>
              {/* <IncomingCallDrawer /> */}
            </>
          )}
        </div>
        <ScrollArea className="h-[50vh]">
          {/* Render messages here, align all messages on left side, timestamp on right side, and an avatar before message and name */}
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message, idx) =>
              message.type == "message" ? (
                <div key={idx}>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`${message.sender.profile_pic}` ?? ""}
                      />
                      <AvatarFallback>
                        {message.sender.first_name[0] +
                          message.sender.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between gap-2">
                        <span className="font-semibold capitalize">
                          {message.sender.first_name +
                            " " +
                            message.sender.last_name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-slate-400">
                          {dayjs(message.timestamp).format("HH:mm A")}
                        </span>
                      </div>
                      <p className="mt-1">{message.text}</p>
                    </div>
                  </div>
                  {message.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md  p-2 "
                    >
                      <a
                        key={index}
                        href={`${attachment.file_url}`}
                        download={attachment.file_name}
                        target="_blank"
                        className="flex items-center gap-2 rounded-md bg-slate-300 p-2 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200 "
                      >
                        <DocumentIcon className="h-5 w-5 text-slate-700 dark:text-slate-300 " />
                        <span className="text-sm ">{attachment.file_name}</span>
                        <span className="text-sm ">{attachment.file_size}</span>
                      </a>
                    </div>
                  ))}
                  <div ref={endOfMessagesRef} />
                </div>
              ) : (
                message.type == "call" && (
                  <a
                    href={`/dashboard/messages/call?callId=${message.id}&conversationId${selectedConversation?.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        `/dashboard/messages/call?callId=${message.id}&conversationId=${selectedConversation?.id}`,
                        "callWindow",
                        "width=800,height=600",
                      );
                    }}
                  >
                    <div
                      key={idx}
                      className="mx-auto flex w-fit cursor-pointer items-center justify-center gap-3 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      {message.caller?.username ?? ""} called to{" "}
                      {message.receiver?.username ?? ""} at{" "}
                      {dayjs(message.start_time).format("DD MMM YY, HH:mm A")}
                    </div>
                  </a>
                )
              ),
            )}
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
          <Input
            id="file"
            type="file"
            multiple
            className="w-fit"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
