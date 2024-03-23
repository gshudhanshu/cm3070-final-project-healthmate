import { render, screen } from "@testing-library/react";
import Hero from "./hero"; // Adjust the import path as needed

describe("Hero Component", () => {
  beforeEach(() => {
    render(<Hero />);
  });

  it("renders without crashing", () => {
    expect(
      screen.getByText("Connecting Care to Communities"),
    ).toBeInTheDocument();
  });

  it("displays the main heading and descriptive text correctly", () => {
    const heading = screen.getByRole("heading", {
      name: "Connecting Care to Communities",
    });
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByText(
        /dedicated to making medical advice and care accessible to underserved communities/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the "Find a Practitioner" and "Join Our Community" buttons', () => {
    expect(
      screen.getByRole("button", { name: "Find a Practitioner" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Join Our Community" }),
    ).toBeInTheDocument();
  });

  it("loads the hero image", () => {
    const image = document.querySelector('img[alt="hero"]');
    expect(image).toBeInTheDocument();
  });
});
