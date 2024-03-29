import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import LoginForm from "@/components/auth/register-form";

// Mocking the LoginForm component
jest.mock("@/components/auth/register-form", () => ({
  __esModule: true,
  default: () => <div>RegisterFormMock</div>,
}));

describe("Page Component", () => {
  it("renders the login form and the hero image", () => {
    render(<Page />);
    expect(screen.getByText("RegisterFormMock")).toBeTruthy();
    // Check for the hero image using the alt text
    expect(screen.getByAltText("hero")).toBeTruthy();
  });
});
