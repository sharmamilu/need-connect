import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { User } from "@/types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const isWeb = Platform.OS === "web";

const secureOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

export const saveToken = async (token: string): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined") {
        if (!token) {
          window.localStorage.removeItem(TOKEN_KEY);
        } else {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
      }
    } else {
      if (!token) {
        await SecureStore.deleteItemAsync(TOKEN_KEY, secureOptions);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token, secureOptions);
      }
    }
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY, secureOptions);
    }
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY, secureOptions);
    }
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const saveUser = async (user: User | null): Promise<void> => {
  try {
    if (!user) {
      await removeUser();
      return;
    }
    const userString = JSON.stringify(user);
    if (isWeb) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(USER_KEY, userString);
      }
    } else {
      await SecureStore.setItemAsync(USER_KEY, userString, secureOptions);
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    let userString: string | null = null;
    if (isWeb) {
      if (typeof window !== "undefined") {
        userString = window.localStorage.getItem(USER_KEY);
      }
    } else {
      userString = await SecureStore.getItemAsync(USER_KEY, secureOptions);
    }

    if (!userString) return null;
    return JSON.parse(userString) as User;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(USER_KEY);
      }
    } else {
      await SecureStore.deleteItemAsync(USER_KEY, secureOptions);
    }
  } catch (error) {
    console.error("Error removing user:", error);
  }
};
