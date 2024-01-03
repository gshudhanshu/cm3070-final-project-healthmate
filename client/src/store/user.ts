import { create } from 'zustand'

type User = {
  name: string
  email: string
}

export const userStore = create((set) => ({
  user: {
    name: 'John Doe',
    email: '',
  },
}))
