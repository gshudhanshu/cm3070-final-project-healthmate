// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserNav } from "./user-nav";
import * as AuthStore from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

// Mock the useAuthStore and useRouter hooks
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  permanentRedirect: jest.fn(),
}));

// Define mock data and functions
const mockUseRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  pathname: "/",
};

describe("UserNav Component", () => {
  // Set up mock data before each test
  beforeEach(() => {
    // Mock useRouter hook
    jest.mocked(useRouter).mockReturnValue(mockUseRouter);
  });

  const mockLogout = jest.fn();
  // Define mock user data
  const mockUser = {
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
  };

  // Set up mock user and logout function before each test
  beforeEach(() => {
    AuthStore.useAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  it("renders user information correctly", async () => {
    const user = userEvent.setup();
    render(<UserNav />);
    // Click on the button to open the dropdown menu
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  it("opens dropdown menu on trigger click", async () => {
    const user = userEvent.setup();
    render(<UserNav />);
    // Click on the button to open the dropdown menu
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it('calls logout on "Log out" click', async () => {
    const user = userEvent.setup();
    render(<UserNav />);
    // Click on the button to open the dropdown menu
    await user.click(screen.getByRole("button"));
    // Click on "Log out" option in the dropdown menu
    await user.click(screen.getByText("Log out"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
