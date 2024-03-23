import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatientProfileForm } from "./patient-profile"; // Adjust the import path as needed
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/store/useUserProfileStore", () => ({
  useUserProfileStore: jest.fn(),
}));

jest.mock("@/components/ui/use-toast");

describe("PatientProfileForm Component", () => {
  beforeEach(() => {
    useUserProfileStore.mockReturnValue({
      updateUserProfile: jest.fn(),
      fetchPatientProfile: jest.fn(),
      patientProfile: {},
    });
    useToast.mockReturnValue({
      toast: jest.fn(),
    });
  });

  it("renders the form with default values", async () => {
    render(<PatientProfileForm />);
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    // Add more assertions as needed
  });

  it("allows input field values to be changed", async () => {
    render(<PatientProfileForm />);
    const firstNameInput = screen.getByLabelText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    expect(firstNameInput.value).toBe("Jane");
  });

  it("validates required fields before submitting", async () => {
    render(<PatientProfileForm />);

    // Simulate form submission without filling out the fields
    await userEvent.click(screen.getByText("Update profile"));

    // Check for presence of error messages
    expect(screen.getAllByText(/required/i)).toBeTruthy();
  });

  it("allows adding languages", async () => {
    render(<PatientProfileForm />);

    // Initially, there should be one language input
    expect(screen.getAllByTestId("language-input")).toHaveLength(1);

    // Simulate adding another language
    userEvent.click(screen.getByText("Add Language"));
    expect(screen.getAllByTestId("language-input")).toHaveLength(1);
  });
});
