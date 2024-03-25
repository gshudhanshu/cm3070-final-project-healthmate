// @ts-nocheck
import { render, screen } from "@testing-library/react";
import React from "react";
import RecentDiagnosis from "./recent-diagnosis";
import * as medicalRecordsStore from "@/store/useMedicalRecordStore";

// Mocking the store
jest.mock("@/store/useMedicalRecordStore");

describe("RecentDiagnosis Component", () => {
  it("renders without crashing", () => {
    // Mocking the store to return an empty diagnosis list
    medicalRecordsStore.useMedicalRecordsStore.mockReturnValue({
      medicalRecord: { diagnosis: [] },
    });
    render(<RecentDiagnosis />);
    expect(screen.getByText("Recent Diagnosis")).toBeInTheDocument();
  });

  it("displays each diagnosis with details", () => {
    // Mocking the store to return a list of diagnoses
    medicalRecordsStore.useMedicalRecordsStore.mockReturnValue({
      medicalRecord: {
        diagnosis: [
          {
            name: "Diagnosis A",
            date: "2023-03-15",
            details: "Details about Diagnosis A",
          },
          {
            name: "Diagnosis B",
            date: "2023-03-14",
            details: "",
          },
        ],
      },
    });
    render(<RecentDiagnosis />);
    expect(screen.getByText("Diagnosis A")).toBeInTheDocument();
    expect(screen.getByText("Details about Diagnosis A")).toBeInTheDocument();
    expect(screen.getByText("Diagnosis B")).toBeInTheDocument();
    expect(screen.getByText("No details available")).toBeInTheDocument();
  });

  it("displays a diagnosis date alongside the name", () => {
    // Mocking the store to return a diagnosis with a date
    medicalRecordsStore.useMedicalRecordsStore.mockReturnValue({
      medicalRecord: {
        diagnosis: [
          {
            name: "Diagnosis A",
            date: "2023-03-15",
            details: "Details for A",
          },
        ],
      },
    });
    render(<RecentDiagnosis />);
    expect(screen.getByText("2023-03-15")).toBeInTheDocument();
  });
});
