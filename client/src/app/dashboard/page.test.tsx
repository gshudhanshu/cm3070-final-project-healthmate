import { render } from "@testing-library/react";
import Page from "./page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  permanentRedirect: jest.fn(),
}));

describe("Page Component", () => {
  it("redirects to /dashboard/messages", () => {
    const { permanentRedirect } = require("next/navigation");

    render(<Page />);

    expect(permanentRedirect).toHaveBeenCalledWith("/dashboard/messages");
  });
});
