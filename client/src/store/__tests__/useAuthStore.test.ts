import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../useAuthStore";

const API_URL = process.env.API_URL;
const LOGIN_URL = `${API_URL}/auth/jwt/create/`;
const USER_URL = `${API_URL}/auth/users/me/`;

describe("useAuthStore", () => {
  let mock: any;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  it("should login and fetch user successfully", async () => {
    const user = { id: 1, username: "testuser" };
    const token = "test-token";

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
    mock.onPost(LOGIN_URL).networkError();

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await expect(
        result.current.login("testuser", "password"),
      ).rejects.toThrow();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should logout successfully", async () => {
    localStorage.setItem("token", "test-token");

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
