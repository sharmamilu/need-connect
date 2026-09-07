import { API } from "../apiFunctions";

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
}) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const forgotPasswordApi = async (data: { email: string }) => {
  const response = await API.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyResetCodeApi = async (data: { email: string; token?: string; code?: string }) => {
  const payload = {
    email: data.email,
    token: data.token || data.code,
    code: data.code || data.token,
  };
  const response = await API.post("/auth/verify-code", payload);
  return response.data;
};

export const resetPasswordApi = async (data: {
  email: string;
  token?: string;
  code?: string;
  password?: string;
  newPassword?: string;
}) => {
  const payload = {
    email: data.email,
    token: data.token || data.code,
    code: data.code || data.token,
    password: data.password || data.newPassword,
  };
  const response = await API.post("/auth/reset-password", payload);
  return response.data;
};
