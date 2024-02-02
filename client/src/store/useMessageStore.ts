// store/useMessagesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";

import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.API_URL;
const CONVERSATIONS_URL = `${API_URL}/conversations/`;

interface Message {
  id: number;
  sender: User;
  type: string;
  text: string;
  timestamp: string;
  conversation: number;
}

interface Conversation {
  id: number;
  patient: User | null;
  doctor: User | null;
  last_message: {
    id: 4;
    sender: User | null;
    text: string;
    timestamp: string;
    conversation: number;
  };
}

interface MessagesState {
  messages: Message[];
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isSidebarVisible: boolean;
  fetchConversations: (username: string) => void;
  fetchMessages: (conversationId: number) => void;
  sendMessage: (
    conversationId: number,
    message: string,
    attchement?: File,
  ) => void;
  selectConversation: (conversations: Conversation) => void;
  toggleSidebar: () => void;
  getOppositeParticipant: (conversation: Conversation) => User | null;
}

export const useMessagesStore = create(
  devtools<MessagesState>((set, get) => ({
    conversations: [],
    messages: [],
    selectedConversation: null,
    isSidebarVisible: true, // Initially, the sidebar is visible
    fetchConversations: async (username: string) => {
      // Placeholder for fetching contacts logic
      console.log("Fetching contacts for user:", username);
      const { token } = useAuthStore.getState();
      const response = await axios.get(`${CONVERSATIONS_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ conversations: response.data });
    },
    fetchMessages: async (conversationId: number) => {
      // Placeholder for fetching messages logic
      console.log("Fetching messages for contact:", conversationId);
      const { token } = useAuthStore.getState();
      const response = await axios.get(
        `${API_URL}/conversations/${conversationId}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      set({ messages: response.data });
    },
    sendMessage: async (
      conversationId: number,
      message: string,
      attachment?: File,
    ) => {
      try {
        const { token } = useAuthStore.getState();
        const formData = new FormData();
        formData.append("text", message);
        if (attachment) {
          formData.append("attachment", attachment);
        }
        await axios.post(
          `${API_URL}/conversations/${conversationId}/messages/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        // Optionally, you can update the messages state with the new message or refetch the messages
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error (e.g., set an error state)
      }
    },

    selectConversation: (conversation) => {
      set({ selectedConversation: conversation });
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
    getOppositeParticipant: (conversation: Conversation) => {
      const currentUser = useAuthStore.getState().user;
      // Assuming the currentUser will always be either doctor or patient
      return currentUser?.account_type === "doctor"
        ? conversation.patient
        : conversation.doctor;
    },
  })),
);
