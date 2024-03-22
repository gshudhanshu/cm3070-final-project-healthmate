// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ForgetForm from "./password-reset-form"; // Adjust the import path as needed
import * as z from "zod";
import { toast } from "../ui/use-toast"; // Import toast function for mocking

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
jest.mock("../ui/use-toast");

describe("ForgetForm Component", () => {
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
    axios.post.mockResolvedValue({});

    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "newPassword123",
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.API_URL}/auth/users/reset_password_confirm/`,
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
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: errorMessage,
        },
      },
    });

    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "newPassword123",
    );
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

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
    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "differentPassword123",
    );
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("shows success notification on successful password reset", async () => {
    axios.post.mockResolvedValue({});

    await userEvent.type(
      screen.getByPlaceholderText("Enter your new password"),
      "newPassword123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm your new password"),
      "newPassword123",
    );
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

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

  // Add more tests as needed
});
