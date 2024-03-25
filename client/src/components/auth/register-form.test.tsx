// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import RegisterForm from "./register-form";
import { useRouter } from "next/navigation";

// Mocking axios and useRouter function
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
  beforeEach(() => {
    render(<RegisterForm />);
  });

  it("renders correctly with default values", () => {
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "patient" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "doctor" })).not.toBeChecked();
  });

  it("submits with valid data", async () => {
    // Mocking resolved value for axios post request
    axios.post.mockResolvedValue({ status: 201 });

    // Selecting radio button for patient
    await fireEvent.click(screen.getByRole("radio", { name: "patient" }));

    // Filling out form fields
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
    // Submitting form
    await fireEvent.click(screen.getByText("Submit"));
    // Waiting for axios post request to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it("validates password match before submitting", async () => {
    // Filling out password fields with mismatched passwords
    await userEvent.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Re-Enter your password"),
      "password1234",
    );

    // Submitting form
    await fireEvent.click(screen.getByText("Submit"));

    // Waiting for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/password do not match/i)).toBeInTheDocument();
    });
  });
});
