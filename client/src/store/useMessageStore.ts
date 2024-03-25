// store/useMessagesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallStore } from "@/store/useCallStore";

import {
  AttachmentResponse,
  Conversation,
  Message,
  MessageData,
} from "@/types/conversation";

// Define the base URL for API endpoints
const API_URL = process.env.API_URL;
const CONVERSATIONS_URL = `${API_URL}/conversations/`;
const SOCKET_URL = `ws://127.0.0.1:8000/`;

// Define the interface for the messages state
interface MessagesState {
  websocket: any;
  messages: Message[];
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isSidebarVisible: boolean;
  fetchConversations: (username: string) => void;
  fetchMessages: (conversationId: number) => void;
  sendMessage: (
    conversationId: number,
    message: string,
    attachments: File[],
  ) => void;
  sendCallMessage: (conversationId: number, callData: any) => void;
  selectConversation: (conversations: Conversation) => void;
  toggleSidebar: () => void;
  getOppositeParticipant: (conversation: Conversation) => User | null;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

export const useMessagesStore = create(
  devtools<MessagesState>((set, get) => ({
    conversations: [],
    messages: [],
    selectedConversation: null,
    isSidebarVisible: true, // Initially, the sidebar is visible
    // Function to fetch conversations for a user
    fetchConversations: async (username: string) => {
      console.log("Fetching contacts for user:", username);
      const { token } = useAuthStore.getState();
      const response = await axios.get(`${CONVERSATIONS_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ conversations: response.data });
    },
    // Function to fetch messages for a conversation
    fetchMessages: async (conversationId: number) => {
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
      // console.log(response.data);
      set({ messages: response.data });
    },
    // Function to select a conversation
    selectConversation: (conversation) => {
      set({ selectedConversation: conversation });
      // In mobile view, when a contact is selected, hide the sidebar
      if (window.innerWidth < 768) {
        // or another breakpoint you're using
        set({ isSidebarVisible: false });
      }
    },
    // Function to toggle the sidebar visibility
    toggleSidebar: () => {
      // Toggle the visibility of the sidebar
      set((state) => ({ isSidebarVisible: !state.isSidebarVisible }));
    },
    // Function to get the opposite participant in a conversation
    getOppositeParticipant: (conversation: Conversation) => {
      const currentUser = useAuthStore.getState().user;
      return currentUser?.account_type === "doctor"
        ? conversation.patient
        : conversation.doctor;
    },

    // ==============
    // WEB SOCKETS
    // ==============

    // Initialize WebSocket connection as null
    websocket: null,

    // Function to connect to WebSocket
    connectWebSocket: () => {
      let conversationId = get().selectedConversation?.id;
      const websocket = new WebSocket(
        `${SOCKET_URL}conversation/${conversationId}/?token=${
          useAuthStore.getState().token
        }`,
      );

      // Handle WebSocket connection
      websocket.onopen = () => {
        console.log("WebSocket Connected");
      };

      // Handle incoming WebSocket messages
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data.type);
        if (data.type === "new_message") {
          set((state) => ({
            messages: [...state.messages, data.message],
          }));
        } else if (data.type === "new_call") {
          set((state) => ({ messages: [...state.messages, data.call] }));
        } else {
          console.log("Invalid action:", data.type);
        }
      };

      set({ websocket });
    },

    // Function to disconnect WebSocket
    disconnectWebSocket: () => {
      get().websocket?.close();
      console.log("WebSocket Disconnected");
      set({ websocket: null });
    },

    // Function to send a message
    sendMessage: async (conversationId, message, attachments: File[] = []) => {
      const { user } = useAuthStore.getState();
      if (!user || !get().websocket) return;

      // Upload attachments and collect their URLs or IDs
      const attachmentPromises: Promise<AttachmentResponse>[] = attachments.map(
        async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          try {
            const response = await axios.post<AttachmentResponse>(
              `${API_URL}/conversations/attachments/`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${useAuthStore.getState().token}`,
                  "Content-Type": "multipart/form-data",
                },
              },
            );
            return response.data; // Return the attachment response
          } catch (error) {
            console.error("Error uploading attachment:", error);
            throw error;
          }
        },
      );

      try {
        const uploadedAttachments = await Promise.all(attachmentPromises);
        // Construct and send the WebSocket message
        const messageData: MessageData = {
          conversationId,
          sender: user.id,
          text: message,
          attachments: uploadedAttachments,
        };
        get().websocket.send(
          JSON.stringify({
            action: "chat_message",
            ...messageData,
          }),
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    // Function to send a call message
    sendCallMessage: async (conversationId, callData) => {
      const { user } = useAuthStore.getState();
      if (!user || !get().websocket) return;

      const messageData = {
        conversationId,
        sender: user.id,
        ...callData,
      };

      get().websocket.send(
        JSON.stringify({
          action: "call_message",
          ...messageData,
        }),
      );
    },
  })),
);
