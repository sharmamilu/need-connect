import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import { BASE_URL } from "./constants";
import { getToken, removeToken, removeUser, saveToken } from "./storage";
import {
  ApiResponse,
  Comment,
  DocumentRecord,
  Listing,
  Portfolio,
  Post,
  Review,
  User,
} from "@/types";

export const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  async (response) => {
    const newToken = response.headers["x-new-token"];
    if (newToken) {
      try {
        await saveToken(newToken);
      } catch (err) {
        console.error("Failed to save auto-renewed token:", err);
      }
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await removeToken();
        await removeUser();
      } catch {}
    }
    return Promise.reject(error);
  },
);

/* ---------- IMAGE UPLOAD HELPERS ---------- */

const appendImagesToFormData = async (
  formData: FormData,
  fieldName: string,
  images: any[],
) => {
  for (let index = 0; index < images.length; index++) {
    const img = images[index];
    if (!img) continue;

    let uri = typeof img === "string" ? img : img.uri;
    if (!uri || uri.startsWith("http://") || uri.startsWith("https://")) {
      continue;
    }

    if (
      Platform.OS === "android" &&
      !uri.startsWith("file://") &&
      !uri.startsWith("content://")
    ) {
      uri = `file://${uri}`;
    }

    const name = img.fileName || `${fieldName}_${index}.jpg`;
    const type = img.mimeType || "image/jpeg";

    if (Platform.OS === "web") {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append(fieldName, blob, name);
      } catch (err) {
        console.error("Failed to convert image to blob on web:", err);
      }
    } else {
      formData.append(fieldName, {
        uri,
        name,
        type,
      } as any);
    }
  }
};

const appendSingleImageToFormData = async (
  formData: FormData,
  fieldName: string,
  image: any,
) => {
  if (!image) return;
  let uri = typeof image === "string" ? image : image.uri;
  if (!uri || uri.startsWith("http://") || uri.startsWith("https://")) {
    return;
  }

  if (
    Platform.OS === "android" &&
    !uri.startsWith("file://") &&
    !uri.startsWith("content://")
  ) {
    uri = `file://${uri}`;
  }

  const name = image.fileName || `${fieldName}.jpg`;
  const type = image.mimeType || "image/jpeg";

  if (Platform.OS === "web") {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append(fieldName, blob, name);
    } catch (err) {
      console.error("Failed to convert image to blob on web:", err);
    }
  } else {
    formData.append(fieldName, {
      uri,
      name,
      type,
    } as any);
  }
};

/* ---------- IMAGE UPLOADS ---------- */

export const uploadProfileImage = async (image: any): Promise<string> => {
  const formData = new FormData();
  await appendSingleImageToFormData(formData, "image", image);

  const token = await getToken();
  const response = await fetch(`${BASE_URL}/upload/profile`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Profile image upload failed: ${response.status} - ${errorText}`);
  }

  const resData = await response.json();
  return resData.data?.url || resData.url;
};

export const uploadPostImages = async (images: any[]): Promise<string[]> => {
  const formData = new FormData();
  await appendImagesToFormData(formData, "images", images);

  const token = await getToken();
  const response = await fetch(`${BASE_URL}/upload/post`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Post images upload failed: ${response.status} - ${errorText}`);
  }

  const resData = await response.json();
  return resData.data?.urls || resData.urls;
};

export const uploadGalleryImages = async (images: any[]): Promise<string[]> => {
  const formData = new FormData();
  await appendImagesToFormData(formData, "images", images);

  const token = await getToken();
  const response = await fetch(`${BASE_URL}/upload/gallery`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gallery images upload failed: ${response.status} - ${errorText}`);
  }

  const resData = await response.json();
  return resData.data?.urls || resData.urls;
};

export const uploadListingImages = async (images: any[]): Promise<string[]> => {
  const formData = new FormData();
  await appendImagesToFormData(formData, "images", images);

  const token = await getToken();
  const response = await fetch(`${BASE_URL}/upload/listing`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Listing images upload failed: ${response.status} - ${errorText}`);
  }

  const resData = await response.json();
  return resData.data?.urls || resData.urls;
};

/* ---------- PORTFOLIO ---------- */

export const createPortfolio = (data: any) => API.post<ApiResponse<Portfolio>>("/portfolio", data);
export const updatePortfolio = (data: any) => API.put<ApiResponse<Portfolio>>("/portfolio", data);
export const fetchMyPortfolio = () => API.get<ApiResponse<Portfolio>>("/portfolio/me");
export const fetchPortfolios = (params: {
  page?: number;
  limit?: number;
  skill?: string;
  location?: string;
  profession?: string;
}) => API.get<ApiResponse<Portfolio[]>>("/portfolio", { params });

export const fetchPortfolioById = (id: string) => API.get<ApiResponse<Portfolio>>(`/portfolio/${id}`);
export const fetchSuggestions = (type: "skill" | "location", query: string) =>
  API.get("/portfolio/suggestions", { params: { type, query } });
export const toggleSavePortfolio = (id: string) => API.post(`/portfolio/${id}/save`);
export const fetchSavedPortfolios = (params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Portfolio[]>>(`/portfolio/saved`, { params });

/* ---------- POSTS ---------- */

export const createPost = (data: { description: string; tags?: string[]; images?: string[]; backgroundStyle?: string | null }) =>
  API.post<ApiResponse<Post>>("/posts", data);
export const fetchFeedPosts = (params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Post[]>>("/posts", { params });
export const fetchMyPosts = (params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Post[]>>("/posts/me", { params });
export const fetchPostsByUser = (userId: string, params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Post[]>>(`/posts/user/${userId}`, { params });
export const deletePost = (postId: string) => API.delete(`/posts/${postId}`);
export const togglePinPost = (postId: string) => API.put(`/posts/${postId}/pin`);
export const toggleSavePost = (postId: string) => API.post(`/posts/${postId}/save`);
export const fetchSavedPosts = (params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Post[]>>(`/posts/saved`, { params });

/* ---------- USERS ---------- */

export const fetchMe = () => API.get<ApiResponse<User>>("/users/me");
export const deleteMyAccount = () => API.delete("/users/me");
export const fetchPreferences = () => API.get("/users/preferences");
export const updatePreferences = (data: any) => API.post("/users/preferences", data);

/* ---------- COMMENTS ---------- */

export const loadComments = async (postId: string, page = 1, limit = 20) => {
  const res = await API.get<ApiResponse<Comment[]>>(`/comments/${postId}`, { params: { page, limit } });
  return res.data;
};

export const postComment = async (postId: string, text: string, parentCommentId: string | null = null) => {
  const res = await API.post<ApiResponse<Comment>>(`/comments/${postId}`, { text, parentCommentId });
  return res.data;
};

export const toggleCommentLike = async (commentId: string) => {
  const res = await API.post(`/comments/${commentId}/like`);
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await API.delete(`/comments/${commentId}`);
  return res.data;
};

/* ---------- LIKES ---------- */

export const toggleLike = (postId: string) => API.post(`/likes/${postId}`);
export const fetchPostLikes = (postId: string, params: { page?: number; limit?: number } = {}) =>
  API.get(`/likes/${postId}`, { params });

/* ---------- REVIEWS ---------- */

export const postReview = (data: any) => API.post<ApiResponse<Review>>("/reviews", data);
export const fetchReviews = (userId: string, params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Review[]>>(`/reviews/${userId}`, { params });
export const fetchReviewStats = (userId: string) => API.get(`/reviews/${userId}/stats`);

/* ---------- LISTINGS ---------- */

export const createListing = (data: any) => API.post<ApiResponse<Listing>>("/listings", data);
export const fetchListings = (
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    location?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  } = {},
) => API.get<ApiResponse<Listing[]>>("/listings", { params });

export const fetchListingById = (id: string) => API.get<ApiResponse<Listing>>(`/listings/${id}`);
export const fetchUserListings = (userId: string, params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<Listing[]>>(`/listings/user/${userId}`, { params });
export const deleteListing = (id: string) => API.delete(`/listings/${id}`);
export const fetchSuggestedOpportunities = () => API.get<ApiResponse<Listing[]>>("/listings/suggested");

/* ---------- ADMIN ---------- */

export const fetchAdminPosts = (params: { page?: number; limit?: number; status?: string } = {}) =>
  API.get("/admin/posts", { params });
export const fetchAdminListings = (params: { page?: number; limit?: number; status?: string } = {}) =>
  API.get("/admin/listings", { params });
export const approvePost = (postId: string) => API.patch(`/admin/posts/${postId}/approve`);
export const rejectPost = (postId: string, rejectionReason: string) =>
  API.patch(`/admin/posts/${postId}/reject`, { rejectionReason });
export const approveListing = (listingId: string) => API.patch(`/admin/listings/${listingId}/approve`);
export const rejectListing = (listingId: string, rejectionReason: string) =>
  API.patch(`/admin/listings/${listingId}/reject`, { rejectionReason });

/* ---------- DOCUMENTS ---------- */

export const generateDocument = (data: any) => API.post<ApiResponse<DocumentRecord>>("/documents", data);
export const fetchDocumentById = (documentId: string) => API.get<ApiResponse<DocumentRecord>>(`/documents/${documentId}`);
export const fetchMyDocuments = (params: { page?: number; limit?: number } = {}) =>
  API.get<ApiResponse<DocumentRecord[]>>("/documents", { params });
export const deleteDocument = (documentId: string) => API.delete(`/documents/${documentId}`);
