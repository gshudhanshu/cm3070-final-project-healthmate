// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import MessagesPage from "./page"; // Adjust the import path as necessary
import { useWindowSize } from "@uidotdev/usehooks";
import { useMessagesStore } from "@/store/useMessageStore";

// Mock components and hooks
jest.mock("@/components/messages/side-bar", () => {
  return function SidebarMock() {
    return <div>Sidebar</div>;
  };
});

jest.mock("@/components/messages/main-thread", () => {
  return function MessageThreadMock() {
    return <div>Messages Thread</div>;
  };
});

jest.mock(
  "@/app/dashboard/medical-records/page",
  () =>
    function MedicalRecordPageMock() {
      return <div>Medical Records</div>;
    },
);

jest.mock("@/components/medical-records/add-new-record", () => {
  return function AddNewRecordMock() {
    return <div>Add New Record</div>;
  };
});

jest.mock("@uidotdev/usehooks", () => ({
  useWindowSize: jest.fn(),
}));
jest.mock("@/store/useMessageStore", () => ({
  useMessagesStore: jest.fn(),
}));

describe("MessagesPage Component", () => {
  beforeEach(() => {
    // Default mock implementations
    useWindowSize.mockReturnValue({ width: 1024 }); // Desktop by default
    useMessagesStore.mockReturnValue({
      isSidebarVisible: true,
      toggleSidebar: jest.fn(),
    });
  });

  it("renders Sidebar and TabComponent for desktop view", () => {
    render(<MessagesPage />);
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Messages Thread")).toBeInTheDocument();
    expect(screen.getByText("Medical Records")).toBeInTheDocument();
  });

  it("renders only Sidebar when isSidebarVisible is true for mobile", () => {
    useWindowSize.mockReturnValue({ width: 500 }); // Mobile width
    useMessagesStore.mockReturnValue({
      isSidebarVisible: true,
      toggleSidebar: jest.fn(),
    });

    render(<MessagesPage />);
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.queryByText("Messages Thread")).not.toBeInTheDocument(); // MainThread should not be rendered
  });

  it("renders TabComponent when isSidebarVisible is false for mobile", () => {
    useWindowSize.mockReturnValue({ width: 500 }); // Mobile width
    useMessagesStore.mockReturnValue({
      isSidebarVisible: false,
      toggleSidebar: jest.fn(),
    });

    render(<MessagesPage />);
    expect(screen.queryByText("Sidebar")).not.toBeInTheDocument(); // Sidebar should not be rendered
    expect(screen.getByText("Messages Thread")).toBeInTheDocument();
  });
});
