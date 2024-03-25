// @ts-nocheck
import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useMessagesStore } from "../useMessageStore";

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
    // Mocked Axios response
    const conversationsMock = [
      { id: 1, name: "Conversation 1" },
      { id: 2, name: "Conversation 2" },
    ];
    mockedAxios.get.mockResolvedValue({ data: conversationsMock });
    // Render the hook and fetch conversations
    const { result } = renderHook(() => useMessagesStore());
    act(() => {
      result.current.fetchConversations("username");
    });
    // Wait for the updates and assert the results
    await waitFor(() => {
      expect(result.current.conversations).toEqual(conversationsMock);
    });
  });

  it("selects a conversation correctly", () => {
    // Render the hook and select a conversation
    const { result } = renderHook(() => useMessagesStore());
    const conversationToSelect = { id: 1, name: "Test Conversation" };

    act(() => {
      result.current.selectConversation(conversationToSelect);
    });
    // Assert the selected conversation
    expect(result.current.selectedConversation).toEqual(conversationToSelect);
  });

  it("connects WebSocket successfully", () => {
    // Render the hook and connect WebSocket
    const { result } = renderHook(() => useMessagesStore());

    act(() => {
      result.current.connectWebSocket();
    });
    // Assert WebSocket connection
    expect(result.current.websocket).not.toBeNull();
  });
});
