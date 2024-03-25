// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./login-form";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

// Mocking useAuthStore and useRouter
jest.mock("@/store/useAuthStore");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm Component", () => {
  // Setting up before each test
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      login: jest.fn(),
    });

    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    render(<LoginForm />);
  });

  it("renders correctly", () => {
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("submits with valid data", async () => {
    // Typing valid username and password
    await userEvent.type(screen.getByPlaceholderText("username"), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );

    // Clicking the submit button
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() =>
      expect(useAuthStore().login).toHaveBeenCalledWith(
        "testuser",
        "password123",
      ),
    );
  });

  it("shows error message on invalid data", async () => {
    // Typing invalid username and password
    await userEvent.type(screen.getByPlaceholderText("username"), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText("Enter your password"),
      "pass",
    );

    // Clicking the submit button
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() =>
      expect(
        screen.getByText("Password must have than 8 characters"),
      ).toBeInTheDocument(),
    );
  });
});
