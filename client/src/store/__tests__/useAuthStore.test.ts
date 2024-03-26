import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../useAuthStore";

// Define API URLs for authentication
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOGIN_URL = `${API_URL}/auth/jwt/create/`;
const USER_URL = `${API_URL}/auth/users/me/`;

describe("useAuthStore", () => {
  let mock: any;

  // Setup axios mock before tests// Setup axios mock before tests
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  // Reset axios mock and clear local storage after each test
  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  it("should login and fetch user successfully", async () => {
    // Define sample user data and token
    const user = { id: 1, username: "testuser" };
    const token = "test-token";

    // Mock API responses for login and user fetching
    mock.onPost(LOGIN_URL).reply(200, { access: token });
    mock.onGet(USER_URL).reply(200, user);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("testuser", "password");
    });

    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(localStorage.getItem("token")).toBe(token);
  });

  it("should handle login error", async () => {
    // Mock network error during login
    mock.onPost(LOGIN_URL).networkError();
    // Render hook and attempt login action
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await expect(
        result.current.login("testuser", "password"),
      ).rejects.toThrow();
    });
    // Assert user is null and token is not stored
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should logout successfully", async () => {
    // Set token in local storage
    localStorage.setItem("token", "test-token");
    // Render hook and perform logout action
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
