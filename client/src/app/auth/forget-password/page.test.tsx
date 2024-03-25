import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mocking the ForgetForm component
jest.mock("@/components/auth/forget-form", () => ({
  __esModule: true,
  default: () => <div>ForgetFormMock</div>,
}));

describe("Page Component", () => {
  it("renders the login form and the hero image", () => {
    render(<Page />);
    expect(screen.getByText("ForgetFormMock")).toBeTruthy();
    // Check for the hero image using the alt text
    expect(screen.getByAltText("hero")).toBeTruthy();
  });
});
