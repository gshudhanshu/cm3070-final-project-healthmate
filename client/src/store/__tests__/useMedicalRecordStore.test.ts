// @ts-nocheck
import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useMedicalRecordsStore } from "../useMedicalRecordStore";
import { toast } from "@/components/ui/use-toast";

// Mocking axios and toast
jest.mock("axios");
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

// Mocking localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useMedicalRecordsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });
  it("should fetch medical records and update the store", async () => {
    // Mocked Axios response
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockMedicalRecord = { id: 1, diagnosis: "Test Diagnosis" };
    mockedAxios.get.mockResolvedValue({ data: mockMedicalRecord });
    // Render the hook and fetch medical records
    const { result } = renderHook(() => useMedicalRecordsStore());
    act(() => {
      result.current.fetchMedicalRecords("testUser");
    });
    // Wait for the updates and assert the results
    await waitFor(() => {
      expect(result.current.medicalRecord).toEqual(mockMedicalRecord);
    });
  });

  it("should call toast with success message on adding medical record", async () => {
    // Mocked Axios response
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ status: 200 });
    window.localStorage.setItem("token", "testToken");
    // Render the hook and add a medical record
    const { result } = renderHook(() => useMedicalRecordsStore());
    await act(async () => {
      await result.current.addMedicalRecord({ diagnosis: "New Diagnosis" });
    });

    expect(toast).toHaveBeenCalledWith({
      title: "Medical record added",
      description: "New medical record has been added",
    });
  });

  it("should update medical record in the store", async () => {
    // Mocked Axios response
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const updatedRecord = { id: 1, diagnosis: "Updated Diagnosis" };
    mockedAxios.patch.mockResolvedValue({ data: updatedRecord });
    window.localStorage.setItem("token", "testToken");
    // Render the hook and update a medical record
    const { result } = renderHook(() => useMedicalRecordsStore());
    act(() => {
      result.current.updateMedicalRecord(1, { diagnosis: "Updated Diagnosis" });
    });
    // Wait for the updates and assert the results
    await waitFor(() => {
      expect(result.current.medicalRecord).toEqual(updatedRecord);
    });
  });
});
