"use client";

import React, { use, useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallStore } from "@/store/useCallStore";
import { useMessagesStore } from "@/store/useMessageStore";
import { Button } from "@/components/ui/button";

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
    if (callId && conversationId) {
      getCallData(callId);
      useCallStore.setState({ conversationId });
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
          audio: true,
          video: {
            facingMode: "user",
            width: {
              min: 640,
              ideal: 1280,
              max: 1920,
            },
            height: {
              min: 480,
              ideal: 720,
              max: 1080,
            },
          },
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
    <div className="container my-10">
      <div>
        <div className="grid grid-rows-1 gap-6 md:grid-cols-2">
          <video
            controls
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full bg-black rounded-lg "
          />
          {isCallJoined && (
            <video
              controls
              ref={remoteVideoRef}
              autoPlay
              className="w-full bg-black rounded-lg "
            />
          )}
        </div>
      </div>
      <div className="flex justify-center w-full my-10">
        {!isCallJoined ? (
          <div className="flex flex-col gap-6 sm:flex-row">
            <Button onClick={joinCall}>Join Call</Button>
            <Button onClick={handleEndCall} variant={"secondary"}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={handleEndCall} variant={"destructive"}>
            End Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default CallPage;
