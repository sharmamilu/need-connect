import { apiClient } from "./apiClient";

export const getMeApi = () => {
  return apiClient("/users/me");
};
