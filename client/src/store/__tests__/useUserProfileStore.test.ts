import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useUserProfileStore } from "../useUserProfileStore";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useUserProfileStore", () => {
  beforeEach(() => {
    // Reset mock function calls before each test
    mockedAxios.get.mockReset();
    mockedAxios.put.mockReset();
  });

  it("fetches doctor profile successfully", async () => {
    // Mocked data for doctor profile
    const doctorProfileData = {
      username: "doctorJohn",
      specialty: "Cardiology",
    };
    mockedAxios.get.mockResolvedValue({ data: doctorProfileData });
    // Render the hook
    const { result } = renderHook(() => useUserProfileStore());
    // Trigger fetchDoctorProfile function
    act(() => {
      result.current.fetchDoctorProfile("doctorJohn");
    });
    // Wait for state updates and assert the results
    await waitFor(() => {
      expect(result.current.doctorProfile).toEqual(doctorProfileData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it("fetches patient profile successfully", async () => {
    // Mocked data for patient profile
    const patientProfileData = { username: "patientJane", age: 30 };
    mockedAxios.get.mockResolvedValue({ data: patientProfileData });
    // Render the hook
    const { result } = renderHook(() => useUserProfileStore());
    act(() => {
      result.current.fetchPatientProfile("patientJane");
    });
    // Wait for state updates and assert the results
    await waitFor(() => {
      expect(result.current.patientProfile).toEqual(patientProfileData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it("updates user profile successfully", async () => {
    // Mocked data for updated profile
    const updatedProfileData = {
      username: "doctorJohn",
      specialty: "Neurology",
    };
    // Render the hook
    mockedAxios.put.mockResolvedValue({ data: updatedProfileData });
    // Trigger updateUserProfile function
    const { result } = renderHook(() => useUserProfileStore());
    await act(async () => {
      await result.current.updateUserProfile(
        "doctorJohn",
        "doctor",
        updatedProfileData,
      );
    });
    // Assert that the doctor profile has been updated
    expect(result.current.doctorProfile).toBeTruthy();
  });
});
