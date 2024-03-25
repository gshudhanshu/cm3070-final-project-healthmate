import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer Component", () => {
  it("renders correctly", () => {
    render(<Footer />);
    const linkElement = screen.getByText(/Health Mate. All Rights Reserved./i);
    expect(linkElement).toBeInTheDocument();
  });

  it("contains the navigation links", () => {
    render(<Footer />);
    // Define the navigation labels
    const navLabels = [
      "Home",
      "Find Practitioner",
      "Dashboard",
      "Contact Us",
      // "Resources",
    ];
    // Expect each navigation label to be present in the document
    navLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("displays the correct copyright statement", () => {
    render(<Footer />);
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Expect the copyright statement to be present in the document
    const copyrightStatement = screen.getByText(
      `© ${currentYear} Health Mate. All Rights Reserved.`,
      { exact: false },
    );
    expect(copyrightStatement).toBeInTheDocument();
  });
});
