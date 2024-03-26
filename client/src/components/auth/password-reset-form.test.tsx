// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ForgetForm from "./password-reset-form";
import * as z from "zod";
import { toast } from "../ui/use-toast";

// Mocking axios and next/navigation
jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    uid: "test-uid",
    token: "test-token",
  }),
}));

// Mocking use-toast hook
jest.mock("../ui/use-toast");

describe("ForgetForm Component", () => {
  // Setting up before each test
  beforeEach(() => {
    render(<ForgetForm />);
  });

  it("renders with initial values from params", () => {
    expect(
      screen.getByPlaceholderText("Enter your new password"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your new password"),
    ).toBeInTheDocument();
  });

  it("submits with valid data and calls API", async () => {
    // Mocking resolved value for axios post
    axios.post.mockResolvedValue({});
    // Typing valid passwords
    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "newPassword123",
    );

    // Clicking the submit button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Waiting for the async action and assertions
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/users/reset_password_confirm/`,
        {
          uid: "test-uid",
          token: "test-token",
          new_password: "newPassword123",
          re_new_password: "newPassword123",
        },
      ),
    );
  });

  it("displays error message on API failure", async () => {
    const errorMessage = "Failed to reset password";

    // Mocking rejected value for axios post
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: errorMessage,
        },
      },
    });

    // Typing valid passwords
    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "newPassword123",
    );
    // Clicking the submit button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Waiting for the async action and assertions
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: errorMessage,
        }),
      ),
    );
  });

  it("validates password match before submitting", async () => {
    // Typing different passwords
    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "differentPassword123",
    );

    // Clicking the submit button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Waiting for the async action and assertions
    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("shows success notification on successful password reset", async () => {
    // Mocking resolved value for axios post
    axios.post.mockResolvedValue({});
    // Typing valid passwords
    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "newPassword123",
    );
    // Clicking the submit button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Waiting for the async action and assertions
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password reset successful",
          description:
            "Your password has been reset successfully. You can now login with your new password",
        }),
      ),
    );
  });
});
