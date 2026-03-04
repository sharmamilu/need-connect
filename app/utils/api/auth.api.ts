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

export const forgotPasswordApi = (payload: { email: string }) => {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
};

export const verifyResetCodeApi = (payload: {
  email: string;
  code: string;
}) => {
  return apiClient("/auth/verify-reset-code", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
};

export const resetPasswordApi = (payload: {
  email: string;
  code: string;
  newPassword: string;
}) => {
  return apiClient("/auth/reset-password", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
};
