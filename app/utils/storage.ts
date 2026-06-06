import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Platform-aware storage
const isWeb = Platform.OS === "web";

export const saveToken = async (token: string): Promise<void> => {
  try {
    if (isWeb) {
      // Use localStorage on web
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
    } else {
      // Use SecureStore on native
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    if (isWeb) {
      // Use localStorage on web
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return null;
    } else {
      // Use SecureStore on native
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    if (isWeb) {
      // Use localStorage on web
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    } else {
      // Use SecureStore on native
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error removing token:", error);
    throw error;
  }
};

// User data storage
export const saveUser = async (user: any): Promise<void> => {
  try {
    const userString = JSON.stringify(user);
    if (isWeb) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(USER_KEY, userString);
      }
    } else {
      await SecureStore.setItemAsync(USER_KEY, userString);
    }
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    let userString: string | null = null;

    if (isWeb) {
      if (typeof window !== "undefined") {
        userString = window.localStorage.getItem(USER_KEY);
      }
    } else {
      userString = await SecureStore.getItemAsync(USER_KEY);
    }

    return userString ? JSON.parse(userString) : null;
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
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

// Dummy default export to satisfy Expo Router's route compiler
export default function DummyStorageRoute() {
  return null;
}

