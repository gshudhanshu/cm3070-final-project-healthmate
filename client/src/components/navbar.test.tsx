import { render, screen, fireEvent } from "@testing-library/react";
import { MainNav } from "./navbar"; // Adjust the import path as needed
import * as AuthStore from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

jest.mock("@/store/useAuthStore");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockUseRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  pathname: "/",
};

const mockUsePathname = jest.fn(() => "/");

describe("MainNav Component", () => {
  const mockUseAuthStore = AuthStore.useAuthStore;

  beforeEach(() => {
    // Reset mocks before each test
    mockUseAuthStore.mockReset();
    jest.mocked(useRouter).mockReturnValue(mockUseRouter);
    jest.mocked(usePathname).mockReturnValue(mockUsePathname());
  });

  it("renders correctly", () => {
    mockUseAuthStore.mockReturnValue({ user: null });
    render(<MainNav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("displays guest actions for unauthenticated users", () => {
    mockUseAuthStore.mockReturnValue({ user: null });
    render(<MainNav />);
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sign Up").length).toBeGreaterThan(0);
  });

  it("displays auth actions for authenticated users", () => {
    mockUseAuthStore.mockReturnValue({ user: { id: 1, name: "John Doe" } });
    render(<MainNav />);
    // expect login button to not be present
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });
});
