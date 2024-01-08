import { create } from "zustand";
import zukeeper from "zukeeper";

// type User = {
//   name: string;
//   email: string;
//   username: string;
//   id: string;
// };

export const userStore = create(
  zukeeper((set: any) => ({
    user: null,
    setUser: (userData: any) => set({ user: userData }),
    logout: () => set({ user: null }),
  })),
);
