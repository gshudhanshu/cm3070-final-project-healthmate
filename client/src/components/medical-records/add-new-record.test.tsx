// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MedicalRecordForm from "./add-new-record";
import * as messageStore from "@/store/useMessageStore";
import * as medicalRecordStore from "@/store/useMedicalRecordStore";

// Mocking the store functions
jest.mock("@/store/useMessageStore");
jest.mock("@/store/useMedicalRecordStore");

describe("MedicalRecordForm Component", () => {
  beforeAll(() => {
    // Mocking stores
    messageStore.useMessagesStore.mockReturnValue({
      selectedConversation: {
        patient: {
          id: 1,
        },
      },
    });

    medicalRecordStore.useMedicalRecordsStore.mockReturnValue({
      addMedicalRecord: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<MedicalRecordForm />);
    expect(screen.getByText("Add New Medical Record")).toBeInTheDocument();
  });

  it("allows dynamic addition and removal of disorders", async () => {
    render(<MedicalRecordForm />);
    // Add a disorder
    const addButton = screen.getAllByText("Add Disorder")[0];
    await userEvent.click(addButton);

    // Check if the input field is added
    let inputFields = screen.getAllByPlaceholderText("Disorder Name");
    expect(inputFields.length).toBe(1);

    const removeButton = screen.getAllByText("Remove")[0];
    await userEvent.click(removeButton);

    // Check if the input field is removed
    inputFields = screen.queryAllByPlaceholderText("Disorder Name");
    expect(inputFields.length).toBe(0);
  });
});
