// @ts-nocheck
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgetForm from "./forget-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/components/ui/use-toast"),
  () => ({
    toast: jest.fn(),
  });

describe("ForgetForm Component", () => {
  it("renders the form", () => {
    render(<ForgetForm />);
    const emailInput = screen.getByPlaceholderText(/example@email.com/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("renders the form and accepts input", () => {
    render(<ForgetForm />);
    const emailInput = screen.getByPlaceholderText(/example@email.com/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  it("submits the form and shows success message", async () => {
    // Setup axios mock for success response
    axios.post.mockResolvedValue({});

    const { getByLabelText, getByRole } = render(<ForgetForm />);
    const emailInput = getByLabelText(/Email/i);
    const submitButton = getByRole("button", { name: /Submit/i });

    // Simulate user input and form submission
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(submitButton);

    // Wait for the async action and assertions
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        email: "user@example.com",
      });
    });
  });
  it("handles server error", async () => {
    // Setup axios mock for failure response
    axios.post.mockRejectedValue({
      response: { data: { detail: "Email not found" } },
    });

    const { getByLabelText, getByRole, getByText } = render(<ForgetForm />);
    const emailInput = getByLabelText(/Email/i);
    const submitButton = getByRole("button", { name: /Submit/i });

    fireEvent.change(emailInput, { target: { value: "unknown@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText(/Email not found/i)).toBeInTheDocument();
    });
  });
});
