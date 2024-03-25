import React, { use } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Page from "./page";
import { useToast } from "@/components/ui/use-toast";

// Mocking the useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  // Mocking the toast function
  useToast: () => ({
    toast: jest.fn().mockImplementation((param) => {
      console.log("Mock toast called with", param);
      return param;
    }),
  }),
}));

describe("Page Component", () => {
  it("renders the form", async () => {
    render(<Page />);
    // Assertions for form elements
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("youremail@example.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Subject of your message"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your message")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("submits form with valid data and shows toast message", async () => {
    render(<Page />);
    // Simulate user interactions
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("youremail@example.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject of your message"), {
      target: { value: "Inquiry" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message"), {
      target: { value: "I have a question about..." },
    });
    fireEvent.click(screen.getByText("Send Message"));
    // Wait for toast message to appear
    await expect(screen.findByText("Message sent")).toBeTruthy();
  });

  it("displays validation errors for empty fields", async () => {
    render(<Page />);
    fireEvent.submit(screen.getByText("Send Message"));
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Subject is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });
  });
});
