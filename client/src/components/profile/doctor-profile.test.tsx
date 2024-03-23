import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DoctorProfileForm } from "./doctor-profile";
import * as UserProfileStore from "@/store/useUserProfileStore";
import * as AuthStore from "@/store/useAuthStore";
import * as Toast from "@/components/ui/use-toast";

jest.mock("@/store/useUserProfileStore");
jest.mock("@/store/useAuthStore");
jest.mock("@/components/ui/use-toast");

describe("DoctorProfileForm", () => {
  beforeAll(() => {
    AuthStore.useAuthStore.mockReturnValue({
      user: { username: "doc123", account_type: "doctor" },
    });

    UserProfileStore.useUserProfileStore.mockReturnValue({
      doctorProfile: {
        user: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
        },
        // More mock profile data as per your defaultValues setup
      },
      fetchDoctorProfile: jest.fn(),
      updateUserProfile: jest.fn(),
    });

    Toast.useToast.mockReturnValue({
      toast: jest.fn(),
    });
  });

  it("renders correctly with initial state", () => {
    render(<DoctorProfileForm />);
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com"),
    ).toBeInTheDocument();
  });

  it("allows input field values to be changed", async () => {
    render(<DoctorProfileForm />);
    const firstNameInput = screen.getByLabelText("First Name");
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");
    expect(firstNameInput.value).toBe("Jane");
  });

  //   it("submits the form with valid data", async () => {
  //     render(<DoctorProfileForm />);
  //     // Fill in form data...
  //     await userEvent.click(screen.getByText("Update profile"));
  //     await waitFor(() => {
  //       expect(
  //         UserProfileStore.useUserProfileStore().updateUserProfile,
  //       ).toHaveBeenCalled();
  //     });
  //   });

  it("displays validation messages for required fields", async () => {
    render(<DoctorProfileForm />);
    const submitButton = screen.getByText("Update profile");
    await userEvent.click(submitButton);
    expect(await screen.findAllByText(/required/i)).toBeTruthy();
  });

  it("allows adding languages dynamically", async () => {
    render(<DoctorProfileForm />);
    const addLanguageButton = screen.getByText("Add Language");
    await userEvent.click(addLanguageButton);

    // Assert a new language field is added
    const languageInputs = await screen.getAllByTestId("language-input");
    expect(languageInputs.length).toBeGreaterThan(0); // Adjust based on initial render
  });
});
