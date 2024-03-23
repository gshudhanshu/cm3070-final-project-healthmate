import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./side-bar";
import * as MessageStore from "@/store/useMessageStore";
import * as AuthStore from "@/store/useAuthStore";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/useMessageStore", () => ({
  useMessagesStore: jest.fn(),
}));

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    // Set up mock return values
    AuthStore.useAuthStore.mockReturnValue({
      user: { username: "testuser", account_type: "patient" },
    });
    MessageStore.useMessagesStore.mockReturnValue({
      conversations: [
        {
          id: "1",
          patient: { first_name: "John", last_name: "Doe", profile_pic: "" },
          doctor: { first_name: "Jane", last_name: "Smith", profile_pic: "" },
          last_message: { text: "Hello there!", timestamp: new Date() },
        },
        // Add more mock conversations as needed
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
    expect(selectConversation).toHaveBeenCalledWith(expect.any(Object)); // Adapt this to match the expected call
  });
});
