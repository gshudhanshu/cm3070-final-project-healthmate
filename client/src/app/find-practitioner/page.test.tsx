// @ts-nocheck
// Page.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page"; // Adjust the path according to your file structure
import { useFindDocStore } from "@/store/useFindDocStore"; // Adjust the path as necessary

jest.mock("@/store/useFindDocStore", () => ({
  useFindDocStore: jest.fn(),
}));

describe("Page Component", () => {
  beforeAll(() => {
    global.ResizeObserver = class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
        this.observations = new Map();
      }

      observe(target) {
        if (this.observations.has(target)) {
          return;
        }
        // Simulate observing an element by storing a reference to it
        this.observations.set(target, {});
      }

      unobserve(target) {
        // Remove the reference to simulate stopping observation
        this.observations.delete(target);
      }

      disconnect() {
        // Clear all observations to simulate disconnecting the observer
        this.observations.clear();
      }

      // Optionally, you can implement a trigger method to manually trigger the callback
      // This can be useful for testing how your component reacts to resize events
      trigger() {
        this.callback(
          [...this.observations.entries()].map(([target]) => ({
            target,
            contentRect: target.getBoundingClientRect(),
          })),
          this,
        );
      }
    };
  });

  beforeEach(() => {
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
