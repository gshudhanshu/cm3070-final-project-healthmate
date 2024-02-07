// store/useMessagesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallStore } from "@/store/useCallStore";

const API_URL = process.env.API_URL;
const CONVERSATIONS_URL = `${API_URL}/conversations/`;
const SOCKET_URL = `ws://127.0.0.1:8000/`;

interface Message {
  id: number;
  sender: User;
  type: string;
  text: string;
  timestamp: string;
  conversation: number;
  attachments: AttachmentResponse[];
  // calls
  caller: User | null;
  receiver: User | null;
  start_time: string;
  end_time: string;
  call_type: string;
}

interface AttachmentResponse {
  id: string;
  file_name: string;
  file_size: string;
  file_extension: string;
  file_url: string;
  file: string;
}

interface Conversation {
  id: number;
  patient: User | null;
  doctor: User | null;
  last_message: Message;
}

interface MessageData {
  conversationId: number;
  sender: number;
  text: string;
  attachments: AttachmentResponse[];
}

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
      // console.log(response.data);
      set({ messages: response.data });
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

    // ==============
    // WEB SOCKETS
    // ==============
    websocket: null,

    connectWebSocket: () => {
      let conversationId = get().selectedConversation?.id;
      const websocket = new WebSocket(
        `${SOCKET_URL}conversation/${conversationId}/?token=${
          useAuthStore.getState().token
        }`,
      );

      websocket.onopen = () => {
        console.log("WebSocket Connected");
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data.type);
        if (data.type === "new_message") {
          set((state) => ({
            messages: [...state.messages, data.message],
          }));
        } else {
          console.log("Invalid action:", data.action);
        }
      };

      set({ websocket });
    },

    disconnectWebSocket: () => {
      get().websocket?.close();
      console.log("WebSocket Disconnected");
      set({ websocket: null });
    },

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
            return response.data; // The response should contain the URL or ID of the uploaded file
          } catch (error) {
            console.error("Error uploading attachment:", error);
            throw error; // You might want to handle this differently
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
        // Handle error
      }
    },
  })),
);
