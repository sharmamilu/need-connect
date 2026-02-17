import { useState } from "react";
import { loginApi } from "../utils/api/auth.api";
import { removeToken, saveToken } from "../utils/storage";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (phone: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginApi({ phone, password });
      await saveToken(res.data.token);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await removeToken();
  };

  return { login, logout, loading };
};
