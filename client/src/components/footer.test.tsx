import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer"; // Adjust the import path as necessary.

describe("Footer Component", () => {
  it("renders correctly", () => {
    render(<Footer />);
    const linkElement = screen.getByText(/Health Mate. All Rights Reserved./i);
    expect(linkElement).toBeInTheDocument();
  });

  it("contains the navigation links", () => {
    render(<Footer />);
    const navLabels = [
      "Home",
      "Find Practitioner",
      "Dashboard",
      "Contact Us",
      "Resources",
    ];
    navLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("displays the correct copyright statement", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightStatement = screen.getByText(
      `© ${currentYear} Health Mate. All Rights Reserved.`,
      { exact: false },
    );
    expect(copyrightStatement).toBeInTheDocument();
  });
});
