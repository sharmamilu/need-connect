import { apiClient } from "./apiClient";

export const getMeApi = (token: string) => {
  return apiClient("/users/me", {
    token,
  });
};
