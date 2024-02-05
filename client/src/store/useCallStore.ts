import { create } from "zustand";
import SimplePeer from "simple-peer";

interface CallState {
  isCallActive: boolean;
  peer: SimplePeer.Instance | null;
  stream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  startCall: (stream: MediaStream) => void;
  answerCall: (signal: any, stream: MediaStream) => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  isCallActive: false,
  peer: null,
  stream: undefined,
  remoteStream: undefined,

  startCall: (stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      // TODO: Send this signal data to the other peer via your signaling method
    });

    peer.on("stream", (remoteStream) => {
      // Set the remote stream in the state
      set({ remoteStream });
    });

    // Set the peer and local stream in the state
    set({ peer, stream, isCallActive: true });
  },

  answerCall: (signal, stream) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.signal(signal); // Signal received from the other peer

    peer.on("signal", (data) => {
      // TODO: Send this signal data to the other peer via your signaling method
    });

    peer.on("stream", (remoteStream) => {
      // Set the remote stream in the state
      set({ remoteStream });
    });

    // Set the peer and local stream in the state
    set({ peer, stream, isCallActive: true });
  },

  endCall: () => {
    const { peer, stream } = get();
    if (peer) {
      peer.destroy(); // Destroy the peer connection
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks on the local stream
    }

    // Reset the state
    set({
      peer: null,
      stream: undefined,
      remoteStream: undefined,
      isCallActive: false,
    });
  },
}));
