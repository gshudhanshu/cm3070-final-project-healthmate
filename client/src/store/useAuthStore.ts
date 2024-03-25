import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";

// Define the base URL for the API and authentication endpoints
const API_URL = process.env.API_URL;
const LOGIN_URL = `${API_URL}/auth/jwt/create/`;
const USER_URL = `${API_URL}/auth/users/me/`;

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

// Retrieve token from localStorage if available
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// Set default Authorization header if token exists
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Create the authentication store with Zustand
export const useAuthStore = create(
  devtools<AuthState>((set, get) => ({
    user: null,
    token: token,
    isLoading: false,
    // Function to log in
    login: async (username, password) => {
      try {
        const response = await axios.post(`${LOGIN_URL}`, {
          username,
          password,
        });
        // If login successful, set token and fetch user details
        if (response.data.access) {
          set({ token: response.data.access });
          localStorage.setItem("token", response.data.access); // Save token
          get().fetchUser(); // Fetch user details
        }
      } catch (error) {
        // Log error and reset user and token
        console.log("Login failed:", error);
        set({ user: null, token: null });
        localStorage.removeItem("token");
        throw error;
      }
    },
    // Function to fetch user details
    fetchUser: async () => {
      set({ isLoading: true });
      try {
        // Fetch user details
        const response = await axios.get(`${USER_URL}`, {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        });
        // Update user state and unset loading indicator
        set({ user: response.data, isLoading: false });
      } catch (error) {
        // Log error and reset user, token, and loading indicator
        console.error("Fetching user failed:", error);
        localStorage.removeItem("token");
        set({ user: null, token: null, isLoading: false });
      }
    },
    // Function to log out
    logout: () => {
      // Reset user and token
      set({ user: null, token: null });
      localStorage.removeItem("token");
    },
  })),
);

// If token exists, fetch user details
if (token) {
  console.log("Fetching user...");
  useAuthStore.getState().fetchUser();
}
