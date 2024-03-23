// @ts-nocheck
import { render, screen } from "@testing-library/react";
import AboutMe from "./about-me"; // Adjust the import path as needed

const mockDoctor = {
  specialties: [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Pediatrics" },
  ],
  experience: 10,
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
  ],
  qualifications: [
    {
      name: "MD",
      start_year: 2000,
      finish_year: 2005,
      university: "Harvard Medical School",
    },
  ],
};

describe("AboutMe Component", () => {
  it("renders specialties correctly", () => {
    render(<AboutMe doctor={mockDoctor} />);
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Pediatrics")).toBeInTheDocument();
  });

  it("displays experience", () => {
    render(<AboutMe doctor={mockDoctor} />);
    expect(screen.getByText("10 years")).toBeInTheDocument();
  });

  it("lists languages with proficiency levels", () => {
    render(<AboutMe doctor={mockDoctor} />);
    expect(screen.getByText("English (Native)")).toBeInTheDocument();
    expect(screen.getByText("Spanish (Fluent)")).toBeInTheDocument();
  });

  it("shows qualifications with details", () => {
    render(<AboutMe doctor={mockDoctor} />);
    const qualificationText = "MD (2000 - 2005)";
    expect(screen.getByText(qualificationText)).toBeInTheDocument();
    expect(screen.getByText("Harvard Medical School")).toBeInTheDocument();
  });
});
