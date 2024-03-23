// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import RegisterForm from "./register-form"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

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

describe("RegisterForm Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    global.ResizeObserver = class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
        this.observations = new Map();
      }

      observe(target) {
        if (this.observations.has(target)) {
          return;
        }
        // Simulate observing an element by storing a reference to it
        this.observations.set(target, {});
      }

      unobserve(target) {
        // Remove the reference to simulate stopping observation
        this.observations.delete(target);
      }

      disconnect() {
        // Clear all observations to simulate disconnecting the observer
        this.observations.clear();
      }

      // Optionally, you can implement a trigger method to manually trigger the callback
      // This can be useful for testing how your component reacts to resize events
      trigger() {
        this.callback(
          [...this.observations.entries()].map(([target]) => ({
            target,
            contentRect: target.getBoundingClientRect(),
          })),
          this,
        );
      }
    };

    render(<RegisterForm />);
  });

  it("renders correctly with default values", () => {
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "patient" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "doctor" })).not.toBeChecked();
  });

  it("submits with valid data", async () => {
    axios.post.mockResolvedValue({ status: 201 });

    await fireEvent.click(screen.getByRole("radio", { name: "patient" }));

    await userEvent.type(screen.getByPlaceholderText("username"), "testuser");
    await userEvent.type(screen.getByPlaceholderText("first name"), "Test");
    await userEvent.type(screen.getByPlaceholderText("last name"), "User");
    await userEvent.type(
      screen.getByPlaceholderText("mail@example.com"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Re-Enter your password"),
      "password123",
    );
    await fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it("validates password match before submitting", async () => {
    await userEvent.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Re-Enter your password"),
      "password1234",
    );
    await fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText(/password do not match/i)).toBeInTheDocument();
    });
  });
});
