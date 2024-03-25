// @ts-nocheck
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page";
import { useFindDocStore } from "@/store/useFindDocStore";

// Mock the useFindDocStore hook
jest.mock("@/store/useFindDocStore", () => ({
  useFindDocStore: jest.fn(),
}));

describe("Page Component", () => {
  beforeEach(() => {
    // Mocking the return values for useFindDocStore hook
    useFindDocStore.mockReturnValue({
      searchDoctors: jest.fn(),
      setSearchParams: jest.fn(),
      doctors: [],
      searchParams: { availability: [] },
      pagination: { total_pages: 0, current_page: 1 },
      fetchDoctorWithSlots: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<Page />);
    expect(screen.getByText("Find doctor")).toBeInTheDocument();
  });

  it("calls searchDoctors on component mount", async () => {
    render(<Page />);
    expect(useFindDocStore().searchDoctors).toHaveBeenCalledTimes(1);
  });

  it("updates search params on input change", async () => {
    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText("Practitioner name"), {
      target: { value: "Dr. Smith" },
    });
    expect(useFindDocStore().setSearchParams).toHaveBeenCalled();
  });

  it("handles checkbox filter change", async () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Full time"));
    expect(useFindDocStore().setSearchParams).toHaveBeenCalled();
  });

  it("check if pagination is rendered", async () => {
    render(<Page />);
    const pagination = screen.getByTestId("pagination-previous");
    expect(pagination).toBeInTheDocument();
  });

  it("handles search button click", async () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Find a doc"));
    expect(useFindDocStore().searchDoctors).toHaveBeenCalled();
  });
});
