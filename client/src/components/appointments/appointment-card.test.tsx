// @ts-nocheck
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppointmentCard from "./appointment-card";
import { useRouter } from "next/navigation";
import { useMessagesStore } from "@/store/useMessageStore";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/useMessageStore", () => ({
  useMessagesStore: jest.fn(),
}));

const push = jest.fn();
useRouter.mockImplementation(() => ({
  push,
}));

const selectConversation = jest.fn();
useMessagesStore.mockImplementation(() => ({
  selectConversation,
}));

describe("AppointmentCard", () => {
  const mockAppointment = {
    id: 1,
    conversation: "conversationId",
    patient: {
      first_name: "John",
      last_name: "Doe",
    },
    doctor: {
      first_name: "Jane",
      last_name: "Doe",
    },
    date: "2024-03-21",
    time: "10:00 AM",
    purpose: "Consultation",
  };

  it("renders the appointment details", () => {
    render(<AppointmentCard appointment={mockAppointment} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("2024-03-21 10:00 AM - 1 Hr")).toBeInTheDocument();
    expect(screen.getByText("Purpose: Consultation")).toBeInTheDocument();
  });

  it('navigates to the message page on "Join" button click', () => {
    render(<AppointmentCard appointment={mockAppointment} />);

    fireEvent.click(screen.getByText("Join"));
    expect(selectConversation).toHaveBeenCalledWith(
      mockAppointment.conversation,
    );
    expect(push).toHaveBeenCalledWith("/dashboard/messages");
  });

  it("handles null appointment gracefully", () => {
    const { container } = render(<AppointmentCard appointment={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
