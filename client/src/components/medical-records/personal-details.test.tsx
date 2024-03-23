import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonalDetails from "./personal-details"; // Adjust the import path as needed
import * as medicalRecordsStore from "@/store/useMedicalRecordStore";

jest.mock("@/store/useMedicalRecordStore");

describe("PersonalDetails Component", () => {
  it("displays no result message when no medical record is found", () => {
    medicalRecordsStore.useMedicalRecordsStore.mockReturnValue({});
    render(<PersonalDetails />);
    expect(screen.getByText("No result found")).toBeInTheDocument();
  });

  it("displays personal information correctly", () => {
    medicalRecordsStore.useMedicalRecordsStore.mockReturnValue({
      medicalRecord: {
        patient: {
          user: {
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
          },
          gender: "Male",
          dob: "1990-01-01",
          height: 180,
          weight: 80,
          blood_group: "O+",
          marital_status: "Single",
          phone: "1234567890",
          address: {
            city: "New York",
            state: "NY",
            postal_code: "10001",
            country: "USA",
          },
          languages: [{ name: "English" }],
          profile_pic: "profile_pic_url",
        },
        disorders: [],
      },
    });
    render(<PersonalDetails />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("180 cm")).toBeInTheDocument();
    expect(screen.getByText("O+")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("displays disorders correctly with hover card details", async () => {
    medicalRecordsStore.useMedicalRecordsStore.mockReturnValue({
      medicalRecord: {
        patient: {
          user: {
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
          },
          gender: "Male",
          dob: "1990-01-01",
          height: 180,
          weight: 80,
          blood_group: "O+",
          marital_status: "Single",
          phone: "1234567890",
          address: {
            city: "New York",
            state: "NY",
            postal_code: "10001",
            country: "USA",
          },
          languages: [],
        },
        disorders: [
          {
            name: "Anxiety",
            first_noticed: "2021-01-01",
            details: "Frequent panic attacks",
          },
        ],
      },
    });
    render(<PersonalDetails />);

    await userEvent.hover(screen.getByText("Anxiety"));
    expect(
      await screen.findByText("Frequent panic attacks"),
    ).toBeInTheDocument();
  });

  // Add more tests for other details as needed
});
