// components/Sidebar.tsx
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      // router.push("/login");
      return;
    }
    fetchConversations(user.username);
  }, [user, fetchConversations, router]);

  const filteredConversations = conversations.filter((conversation) => {
    const accountType =
      user && user.account_type !== "patient" ? "doctor" : "patient";
    const fullName =
      `${conversation[accountType]?.first_name} ${conversation[accountType]?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <aside className={cn("bg-slate-100 p-4", className)}>
      <h2 className="mb-6 text-3xl font-medium">Messages</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[60vh] max-h-[60vh] [&>div>div]:!block">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center gap-2 p-2 hover:bg-slate-200"
            onClick={() => selectConversation(conversation)}
          >
            <Avatar className="flex-shrink-0 rounded-lg">
              <AvatarImage
                src={
                  `${getOppositeParticipant(conversation)?.profile_pic}` || ""
                }
              />
              <AvatarFallback>
                {getOppositeParticipant(conversation)?.first_name[0] ??
                  "" + getOppositeParticipant(conversation)?.last_name[0] ??
                  ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full min-w-0">
              <div className="flex justify-between w-full min-w-0 gap-3">
                <p className="font-medium truncate">
                  {getOppositeParticipant(conversation)?.first_name +
                    " " +
                    getOppositeParticipant(conversation)?.last_name}
                </p>
                <p className="block text-xs text-slate-500">
                  {conversation.last_message &&
                    dayjs(conversation.last_message.timestamp).format(
                      "ddd, MMM D",
                    )}
                </p>
              </div>
              <p className="text-sm truncate max-w-80 text-slate-500">
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
