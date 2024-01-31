// store/useMessagesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Message {
  id: number;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
}

interface MessagesState {
  messages: Message[];
  selectedContact: string | null;
  fetchMessages: (contactId: string) => void;
  selectContact: (contactId: string) => void;
  // Add other necessary actions and states
}

export const useMessagesStore = create(
  devtools<MessagesState>((set) => ({
    messages: [],
    selectedContact: null,
    fetchMessages: (contactId: string) => {
      // Placeholder for fetching messages logic
      console.log("Fetching messages for contact:", contactId);
    },
    selectContact: (contactId: string) => {
      set({ selectedContact: contactId });
    },
    // Add other necessary actions
  })),
);
