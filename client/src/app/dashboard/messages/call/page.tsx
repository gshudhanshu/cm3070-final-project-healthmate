"use client";

import React, { use, useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallStore } from "@/store/useCallStore";
import { useMessagesStore } from "@/store/useMessageStore";

const CallPage = () => {
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");
  const conversationId = searchParams.get("conversationId");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    connectCallWebSocket,
    initiateCall,
    peer,
    startCall,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    endCall,
    callData,
    localStream,
    getCallData,
    remoteStream,
  } = useCallStore();
  const [isCallJoined, setIsCallJoined] = useState(false);

  useEffect(() => {
    if (callId) {
      getCallData(callId);
      connectCallWebSocket(callId);
    }
    return () => {
      endCall(); // Clean up on component unmount
    };
  }, [callId]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current)
          localVideoRef.current.srcObject = localStream;
        useCallStore.setState({ localStream });
      } catch (err) {
        console.error("Failed to get user media", err);
      }
    };
    getMedia();
  }, []);

  const joinCall = () => {
    if (!localStream) {
      alert("Media stream not found");
    } else {
      setIsCallJoined(true);
      startCall(localStream);
    }
    // Additional logic for joining the call
    // e.g., sending a WebSocket message to notify other participants
  };

  const handleEndCall = () => {
    endCall();
    window.close();
  };

  useEffect(() => {
    if (peer) {
      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStream;
      });
    }
  }, [peer]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="bg-black rounded-lg"
        />
        {isCallJoined && (
          <video
            ref={remoteVideoRef}
            autoPlay
            className="bg-black rounded-lg"
          />
        )}
      </div>
      {!isCallJoined ? (
        <>
          <button
            onClick={joinCall}
            className="px-4 py-2 m-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            Join Call
          </button>
          <button
            onClick={handleEndCall}
            className="px-4 py-2 m-2 text-white bg-gray-500 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={handleEndCall}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
        >
          End Call
        </button>
      )}
    </div>
  );
};

export default CallPage;
