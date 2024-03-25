"use client";
import React, { useEffect, useState } from "react";
import { useMessagesStore } from "@/store/useMessageStore";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const Sidebar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    selectConversation,
    fetchConversations,
    conversations,
    getOppositeParticipant,
  } = useMessagesStore();

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch conversations when the user changes or when the component mounts
  useEffect(() => {
    if (!user) {
      // router.push("/login");
      return;
    }
    // Fetch conversations based on the user's username
    fetchConversations(user.username);
  }, [user, fetchConversations, router]);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    // Determine account type (patient or doctor)
    const accountType =
      user && user.account_type === "patient" ? "doctor" : "patient";

    // Combine first and last name for search
    const fullName =
      `${conversation[accountType]?.first_name} ${conversation[accountType]?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <aside className={cn("bg-slate-100 p-4 dark:bg-slate-800", className)}>
      <h2 className="mb-6 text-3xl font-medium">Messages</h2>
      <div className="mb-4">
        {/* Input for searching conversations */}
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Scrollable area for conversation list */}
      <ScrollArea className="h-[70vh] max-h-[70vh] [&>div>div]:!block">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-600"
            onClick={() => selectConversation(conversation)}
          >
            {/* Display opposite participant's avatar */}
            <Avatar className="flex-shrink-0 rounded-lg">
              <AvatarImage
                src={
                  `${getOppositeParticipant(conversation)?.profile_pic}` || ""
                }
              />
              {/* Display fallback initials if profile pic is not available */}
              <AvatarFallback>
                {getOppositeParticipant(conversation)?.first_name[0] ??
                  "" + getOppositeParticipant(conversation)?.last_name[0] ??
                  ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex w-full min-w-0 flex-col">
              {/* Display opposite participant's name and last message timestamp */}
              <div className="flex w-full min-w-0 justify-between gap-3">
                <p className="truncate font-medium">
                  {getOppositeParticipant(conversation)?.first_name +
                    " " +
                    getOppositeParticipant(conversation)?.last_name}
                </p>
                {/* Format last message timestamp */}
                <p className="block text-xs text-slate-500 dark:text-slate-400">
                  {conversation.last_message &&
                    dayjs(conversation.last_message.timestamp).format(
                      "ddd, MMM D",
                    )}
                </p>
              </div>
              {/* Display last message text */}
              <p className="max-w-80 truncate text-sm text-slate-500 dark:text-slate-400">
                {conversation.last_message?.text}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
