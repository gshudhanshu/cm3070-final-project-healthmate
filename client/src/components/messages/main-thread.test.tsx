import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageThread from "./main-thread"; // Adjust the import path as needed
import * as MessageStore from "@/store/useMessageStore";
import * as CallStore from "@/store/useCallStore";
// import { useHooks } from "@uidotdev/usehooks";

jest.mock("@/store/useMessageStore", () => ({
  useMessagesStore: jest.fn(),
}));

jest.mock("@/store/useCallStore", () => ({
  useCallStore: jest.fn(),
}));

jest.mock("@uidotdev/usehooks");

describe("MessageThread Component", () => {
  const mockFetchMessages = jest.fn();
  const mockSendMessage = jest.fn();
  const mockInitiateCall = jest.fn();

  beforeEach(() => {
    // Mock stores with default values
    MessageStore.useMessagesStore.mockReturnValue({
      selectedConversation: null,
      messages: [],
      fetchMessages: mockFetchMessages,
      sendMessage: mockSendMessage,
      // Additional mocked functions and properties
    });

    CallStore.useCallStore.mockReturnValue({
      initiateCall: mockInitiateCall,
      // Additional mocked functions and properties
    });
  });

  it("renders with message for no selected conversation", () => {
    render(<MessageThread />);
    expect(screen.getByText("Select a conversation")).toBeInTheDocument();
  });

  it("displays messages for a selected conversation", () => {
    MessageStore.useMessagesStore.mockReturnValue({
      selectedConversation: { id: 1, name: "John Doe" },
      messages: [
        {
          id: 1,
          text: "Hello, World!",
          sender: { first_name: "John", last_name: "Doe" },
          timestamp: new Date(),
          attachments: [],
          type: "message",
        },
      ],
      fetchMessages: mockFetchMessages,
      sendMessage: mockSendMessage,
      getOppositeParticipant: jest.fn(),
      connectWebSocket: jest.fn(),
      disconnectWebSocket: jest.fn(),
      sendCallMessage: jest.fn(),
    });

    render(<MessageThread />);
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });
});
