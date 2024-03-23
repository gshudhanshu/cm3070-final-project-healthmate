import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useUserProfileStore } from "../useUserProfileStore"; // Adjust the import path

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useUserProfileStore", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.put.mockReset();
  });

  it("fetches doctor profile successfully", async () => {
    const doctorProfileData = {
      username: "doctorJohn",
      specialty: "Cardiology",
    };
    mockedAxios.get.mockResolvedValue({ data: doctorProfileData });

    const { result } = renderHook(() => useUserProfileStore());
    act(() => {
      result.current.fetchDoctorProfile("doctorJohn");
    });

    await waitFor(() => {
      expect(result.current.doctorProfile).toEqual(doctorProfileData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it("fetches patient profile successfully", async () => {
    const patientProfileData = { username: "patientJane", age: 30 };
    mockedAxios.get.mockResolvedValue({ data: patientProfileData });

    const { result } = renderHook(() => useUserProfileStore());
    act(() => {
      result.current.fetchPatientProfile("patientJane");
    });

    await waitFor(() => {
      expect(result.current.patientProfile).toEqual(patientProfileData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it("updates user profile successfully", async () => {
    const updatedProfileData = {
      username: "doctorJohn",
      specialty: "Neurology",
    };
    mockedAxios.put.mockResolvedValue({ data: updatedProfileData });

    const { result } = renderHook(() => useUserProfileStore());
    await act(async () => {
      await result.current.updateUserProfile(
        "doctorJohn",
        "doctor",
        updatedProfileData,
      );
    });

    expect(result.current.doctorProfile).toBeTruthy();
  });
});
