import { create } from "zustand";
import SimplePeer from "simple-peer";
import { useMessagesStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

// Define the base URL for the API and WebSocket
const API_URL = process.env.API_URL;
const SOCKET_URL = process.env.SOCKET_URL;

// Define the shape of the call state
interface CallState {
  callWebSocket: any;
  connectCallWebSocket: (callId: string) => void;
  disconnectCallWebSocket: () => void;
  callData: any;
  getCallData: (callId: string) => void;
  conversationId: string | null;
  isCallActive: boolean;
  peer: SimplePeer.Instance | null;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  initiateCall: (conversationId: number) => void;
  startCall: (stream: MediaStream) => void;
  handleOffer: (offer: any) => void;
  handleAnswer: (answer: any) => void;
  handleIceCandidate: (candidate: any) => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  // Initialize state
  callWebSocket: null,
  callData: null,
  conversationId: null,
  isCallActive: false,
  peer: null,
  localStream: undefined,
  remoteStream: undefined,

  // Function to fetch call data
  getCallData: (callId: string) => {
    const token = useAuthStore.getState().token;
    axios
      .get(`${API_URL}/conversations/calls/${callId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        set({ callData: response.data });
      })
      .catch((error) => {
        console.error("Call data fetch failed:", error);
      });
  },

  // Function to initiate a call
  initiateCall: async (conversationId: any) => {
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.post(
        `${API_URL}/conversations/calls/`,
        {
          conversationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("conversationID", conversationId);
      set({
        callData: response.data,
        conversationId,
      });
    } catch (error) {
      console.error("Call initiation failed:", error);
    }
  },

  // Function to connect to WebSocket for signaling
  connectCallWebSocket: (callId) => {
    const { token } = useAuthStore.getState();
    const callWebSocket = new WebSocket(
      `${SOCKET_URL}/call/${callId}/?token=${token}`,
    );
    callWebSocket.onopen = () => console.log("Call WebSocket Connected");
    callWebSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle different types of messages
      console.log("Call WebSocket Message:", data);

      if (data.type === "webrtc_offer" && get().isCallActive) {
        get().handleOffer(data.offer);
      } else if (data.type === "webrtc_answer") {
        get().handleAnswer(data.answer);
      } else if (data.type === "ice_candidate") {
        get().handleIceCandidate(data.candidate);
      } else {
        console.log("Invalid action:", data);
      }
    };
    callWebSocket.onclose = () => console.log("Call WebSocket Disconnected");
    set({ callWebSocket });
  },

  // Function to disconnect WebSocket
  disconnectCallWebSocket: () => {
    get().callWebSocket?.close();
    set({ callWebSocket: null });
  },

  // Function to start a call
  startCall: (stream) => {
    const { callWebSocket, conversationId } = get();
    if (!stream || !callWebSocket) {
      console.log("Invalid stream or callWebSocket");
      return;
    }

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      if (data.type === "offer") {
        callWebSocket.send(
          JSON.stringify({
            action: "webrtc_offer",
            offer: data,
            conversationId: conversationId,
          }),
        );
      }
    });

    // peer.on("stream", (remoteStream) => {
    //   console.log("remoteStream", remoteStream);
    //   set({ remoteStream });
    // });

    set({
      peer,
      isCallActive: true,
      localStream: stream,
    });
  },

  // Function to handle incoming offer
  handleOffer: (offer) => {
    const { callWebSocket, localStream, conversationId } = get();
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: localStream,
    });

    // peer.signal(offer);

    peer.on("signal", (data) => {
      if (data.type === "answer") {
        callWebSocket.send(
          JSON.stringify({
            action: "webrtc_answer",
            answer: data,
            conversationId: conversationId,
          }),
        );
      }
    });

    // Stream handling
    peer.on("stream", (remoteStream) => {
      set({ remoteStream });
    });

    // Process received offer
    peer.signal(offer);

    set({ peer, isCallActive: true });
  },

  // Function to handle incoming answer
  handleAnswer: (answer) => {
    const peer = get().peer;
    if (peer) {
      peer.signal(answer);
    }
  },

  // Function to handle ICE candidates
  handleIceCandidate: (candidate) => {
    const peer = get().peer;
    if (peer) {
      peer.signal(candidate);
    }
  },

  // Function to end the call
  endCall: () => {
    const { peer, localStream } = get();
    if (peer) {
      peer.destroy();
    }
    if (localStream && typeof localStream.getTracks === "function") {
      localStream.getTracks().forEach((track) => track.stop());
    } else {
      console.error("Invalid stream object:", localStream);
    }

    // Reset the call state
    set({
      callData: null,
      conversationId: null,
      peer: null,
      localStream: undefined,
      remoteStream: undefined,
      isCallActive: false,
    });
  },
}));
