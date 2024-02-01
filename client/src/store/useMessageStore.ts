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
  isSidebarVisible: boolean;
  fetchMessages: (contactId: string) => void;
  selectContact: (contactId: string) => void;
  toggleSidebar: () => void;
}

export const useMessagesStore = create(
  devtools<MessagesState>((set, get) => ({
    messages: [],
    selectedContact: null,
    isSidebarVisible: true, // Initially, the sidebar is visible
    fetchMessages: (contactId: string) => {
      // Placeholder for fetching messages logic
      console.log("Fetching messages for contact:", contactId);
    },
    selectContact: (contactId: string) => {
      set({ selectedContact: contactId });
      // In mobile view, when a contact is selected, hide the sidebar
      if (window.innerWidth < 768) {
        // or another breakpoint you're using
        set({ isSidebarVisible: false });
      }
    },
    toggleSidebar: () => {
      // Toggle the visibility of the sidebar
      set((state) => ({ isSidebarVisible: !state.isSidebarVisible }));
    },
  })),
);
