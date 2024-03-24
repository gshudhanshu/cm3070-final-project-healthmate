import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";

const API_URL = process.env.API_URL;
const LOGIN_URL = `${API_URL}/auth/jwt/create/`;
const USER_URL = `${API_URL}/auth/users/me/`;

interface AuthState {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const useAuthStore = create(
  devtools<AuthState>((set, get) => ({
    user: null,
    token: token,
    login: async (username, password) => {
      try {
        const response = await axios.post(`${LOGIN_URL}`, {
          username,
          password,
        });
        if (response.data.access) {
          set({ token: response.data.access });
          localStorage.setItem("token", response.data.access); // Save token
          get().fetchUser(); // Fetch user details
        }
      } catch (error) {
        console.log("Login failed:", error);
        set({ user: null, token: null });
        localStorage.removeItem("token");
        throw error;
      }
    },
    fetchUser: async () => {
      try {
        const response = await axios.get(`${USER_URL}`, {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        });
        set({ user: response.data });
      } catch (error) {
        console.error("Fetching user failed:", error);
        // Handle error
      }
    },
    logout: () => {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    },
  })),
);

if (token) {
  console.log("Fetching user...");
  useAuthStore.getState().fetchUser();
}
