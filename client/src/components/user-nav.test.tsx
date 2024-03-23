import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserNav } from "./user-nav"; // Adjust the import path as needed
import * as AuthStore from "@/store/useAuthStore";

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("UserNav Component", () => {
  const mockLogout = jest.fn();
  const mockUser = {
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
  };

  beforeEach(() => {
    AuthStore.useAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  it("renders user information correctly", async () => {
    const user = userEvent.setup();
    render(<UserNav />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  it("opens dropdown menu on trigger click", async () => {
    const user = userEvent.setup();
    render(<UserNav />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it('calls logout on "Log out" click', async () => {
    const user = userEvent.setup();
    render(<UserNav />);
    await user.click(screen.getByRole("button")); // Open dropdown
    await user.click(screen.getByText("Log out"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
