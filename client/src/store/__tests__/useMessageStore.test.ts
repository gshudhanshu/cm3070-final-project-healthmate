import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useMessagesStore } from "../useMessageStore"; // Adjust import path

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock WebSocket
class WebSocketMock {
  constructor(url) {
    console.log(`WebSocket Connected to ${url}`);
  }

  onopen() {}
  onmessage() {}
  send(data) {
    console.log(`WebSocket Message Sent: ${data}`);
  }
  close() {
    console.log("WebSocket Disconnected");
  }
}

global.WebSocket = WebSocketMock as any;

describe("useMessagesStore", () => {
  it("fetches conversations successfully", async () => {
    const conversationsMock = [
      { id: 1, name: "Conversation 1" },
      { id: 2, name: "Conversation 2" },
    ];
    mockedAxios.get.mockResolvedValue({ data: conversationsMock });

    const { result } = renderHook(() => useMessagesStore());
    act(() => {
      result.current.fetchConversations("username");
    });

    await waitFor(() => {
      expect(result.current.conversations).toEqual(conversationsMock);
    });
  });

  it("selects a conversation correctly", () => {
    const { result } = renderHook(() => useMessagesStore());
    const conversationToSelect = { id: 1, name: "Test Conversation" };

    act(() => {
      result.current.selectConversation(conversationToSelect);
    });

    expect(result.current.selectedConversation).toEqual(conversationToSelect);
  });

  it("connects WebSocket successfully", () => {
    const { result } = renderHook(() => useMessagesStore());

    act(() => {
      result.current.connectWebSocket();
    });

    expect(result.current.websocket).not.toBeNull();
  });
});
