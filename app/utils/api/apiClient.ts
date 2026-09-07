import { BASE_URL } from "../constants";
import { getToken } from "../storage";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  skipAuth?: boolean; // For public endpoints like login/register
};

/**
 * Lightweight fetch wrapper used by the auth flow.
 *
 * It is intentionally defensive: the network can fail, the server can return
 * an empty body, HTML, or plain text (e.g. proxy/timeout pages), and the user
 * should always see a clear, human-readable message instead of a raw
 * "JSON Parse error" or "Network request failed".
 */
export const apiClient = async (
  endpoint: string,
  { method = "GET", body, skipAuth = false }: RequestOptions = {},
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Automatically get token from secure storage for protected routes
  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Thrown when the device can't reach the server at all.
    throw new Error(
      "Can't reach the server. Please check your internet connection and try again.",
    );
  }

  // Safely parse the body — it may be empty or not JSON.
  const raw = await res.text();
  let data: any = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const fallback =
      res.status === 429
        ? "Too many attempts. Please wait a moment and try again."
        : res.status >= 500
          ? "Something went wrong on our end. Please try again shortly."
          : "Something went wrong. Please try again.";
    throw new Error(data?.message || fallback);
  }

  return data;
};

// Dummy default export to satisfy Expo Router's route compiler
export default function DummyApiClientRoute() {
  return null;
}
