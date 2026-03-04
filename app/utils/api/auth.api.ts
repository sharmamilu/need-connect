import { apiClient } from "./apiClient";

export const registerApi = (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  dateOfBirth?: string;
}) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: payload,
    skipAuth: true, // Public endpoint
  });
};

export const loginApi = (payload: { email: string; password: string }) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
    skipAuth: true, // Public endpoint
  });
};
