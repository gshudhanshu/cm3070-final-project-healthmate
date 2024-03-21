import { jest } from "@jest/globals";

const useRouter = jest.fn(() => ({
  push: jest.fn(),
}));
export { useRouter };
