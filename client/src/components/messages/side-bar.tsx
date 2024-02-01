// components/Sidebar.tsx
import React, { useState } from "react";
import { useMessagesStore } from "@/store/useMessageStore";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = ({ className }: { className?: string }) => {
  const { selectContact } = useMessagesStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy contacts
  const contacts = [
    {
      id: 1,
      name: "Mark Barton",
      lastMessage: "dfg fgghnd dfsg sd gf gh fgd fg tn yrft ydfr gdx ",
      lasttimestamp: "2023-01-09 16:33:22 EST",
    },
    {
      id: 2,
      name: "Dr. Destin Roberts",
      lastMessage:
        "dfg fgghnd dfsg sd gf gh fgd fg tn yrft ydfr gdx  g xfth yjh",
      lasttimestamp: "2023-01-09 16:33:22 EST",
    },

    // ... more contacts
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-2 p-2 hover:bg-slate-200"
            onClick={() => selectContact(contact.name)}
          >
            <Avatar className="flex-shrink-0 rounded-lg">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex w-full min-w-0 flex-col">
              <div className="flex w-full min-w-0 justify-between">
                <p className="truncate font-medium">{contact.name}</p>
                <p className="block text-xs text-slate-500">
                  {dayjs(contact.lasttimestamp).format("ddd, MMM D")}
                </p>
              </div>
              <p className="max-w-60 truncate text-sm text-slate-500">
                {contact.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
