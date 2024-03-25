// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./side-bar";
import * as MessageStore from "@/store/useMessageStore";
import * as AuthStore from "@/store/useAuthStore";

// Mock the useRouter function from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the useMessagesStore hook
jest.mock("@/store/useMessageStore", () => ({
  useMessagesStore: jest.fn(),
}));

// Mock the useAuthStore hook
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    // Set up mock return values
    AuthStore.useAuthStore.mockReturnValue({
      user: { username: "testuser", account_type: "patient" },
    });
    // Set up mock return values for useMessagesStore
    MessageStore.useMessagesStore.mockReturnValue({
      conversations: [
        {
          id: "1",
          patient: { first_name: "John", last_name: "Doe", profile_pic: "" },
          doctor: { first_name: "Jane", last_name: "Smith", profile_pic: "" },
          last_message: { text: "Hello there!", timestamp: new Date() },
        },
      ],
      fetchConversations: jest.fn(),
      selectConversation: jest.fn(),
      getOppositeParticipant: jest
        .fn()
        .mockImplementation(
          (conversation) => conversation.patient || conversation.doctor,
        ),
    });
  });

  it("renders with Messages title and search box", () => {
    render(<Sidebar />);
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("displays conversations correctly", () => {
    render(<Sidebar />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("selects a conversation on click", async () => {
    const { selectConversation } = MessageStore.useMessagesStore();
    render(<Sidebar />);
    await userEvent.click(screen.getByText("John Doe"));
    expect(selectConversation).toHaveBeenCalledWith(expect.any(Object));
  });
});
