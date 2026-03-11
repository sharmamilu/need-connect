import { getToken } from "../storage";

const BASE_URL = "https://need-connect-backend.onrender.com/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  skipAuth?: boolean; // For public endpoints like login/register
};

export const apiClient = async (
  endpoint: string,
  { method = "GET", body, skipAuth = false }: RequestOptions = {},
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Automatically get token from secure storage for protected routes
  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};
