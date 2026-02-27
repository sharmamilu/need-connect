import axios from "axios";
import { getToken } from "./storage";

const BASE_URL = "http://192.168.1.2:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- IMAGE UPLOAD ---------- */

export const uploadProfileImage = async (image: any) => {
  const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  const res = await API.post("/upload/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data?.url || res.data?.url;
};

export const uploadPostImages = async (images: any[]) => {
  const formData = new FormData();

  images.forEach((img, index) => {
    formData.append("images", {
      uri: img.uri,
      name: `post_${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const res = await API.post("/upload/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data?.urls || res.data?.urls;
};

export const uploadGalleryImages = async (images: any[]) => {
  const formData = new FormData();

  images.forEach((img, index) => {
    formData.append("images", {
      uri: img.uri,
      name: `gallery_${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const res = await API.post("/upload/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data?.urls || res.data?.urls;
};

/* ---------- PORTFOLIO ---------- */

export const createPortfolio = (data: any) => API.post("/portfolio", data);

export const updatePortfolio = (data: any) => API.put("/portfolio", data);

export const fetchMyPortfolio = () => API.get("/portfolio/me");

export const fetchPortfolios = (params: {
  page?: number;
  limit?: number;
  skill?: string;
  location?: string;
  profession?: string;
}) => API.get("/portfolio", { params });

export const fetchPortfolioById = (id: string) => API.get(`/portfolio/${id}`);

export const fetchSuggestions = (type: "skill" | "location", query: string) =>
  API.get("/portfolio/suggestions", { params: { type, query } });

export const toggleSavePortfolio = (id: string) =>
  API.post(`/portfolio/${id}/save`);

export const fetchSavedPortfolios = (
  params: { page?: number; limit?: number } = {},
) => API.get(`/portfolio/saved`, { params });

export const createPost = (data: {
  description: string;
  tags?: string[];
  images?: string[];
}) => API.post("/posts", data);

export const fetchFeedPosts = (
  params: { page?: number; limit?: number } = {},
) => API.get("/posts", { params });

export const fetchMyPosts = (params: { page?: number; limit?: number } = {}) =>
  API.get("/posts/me", { params });

export const fetchPostsByUser = (
  userId: string,
  params: { page?: number; limit?: number } = {},
) => API.get(`/posts/user/${userId}`, { params });

export const fetchMe = () => API.get("/users/me");

export const fetchPreferences = () => API.get("/users/preferences");
export const updatePreferences = (data: any) =>
  API.post("/users/preferences", data);

export const deletePost = (postId: string) => API.delete(`/posts/${postId}`);

export const togglePinPost = (postId: string) =>
  API.put(`/posts/${postId}/pin`);

export const toggleSavePost = (postId: string) =>
  API.post(`/posts/${postId}/save`);

export const fetchSavedPosts = (
  params: { page?: number; limit?: number } = {},
) => API.get(`/posts/saved`, { params });

/* ---------- COMMENTS ---------- */

export const loadComments = async (postId: string, page = 1, limit = 20) => {
  const params = { page, limit };
  const res = await API.get(`/comments/${postId}`, { params });
  return res.data;
};

export const postComment = async (
  postId: string,
  text: string,
  parentCommentId: string | null = null,
) => {
  const res = await API.post(`/comments/${postId}`, { text, parentCommentId });
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

export const fetchPostLikes = (
  postId: string,
  params: { page?: number; limit?: number } = {},
) => API.get(`/likes/${postId}`, { params });

/* ---------- REVIEWS ---------- */

export const postReview = (data: any) => API.post("/reviews", data);

export const fetchReviews = (
  userId: string,
  params: { page?: number; limit?: number } = {},
) => API.get(`/reviews/${userId}`, { params });

export const fetchReviewStats = (userId: string) =>
  API.get(`/reviews/${userId}/stats`);

/* ---------- LISTINGS ---------- */

export const uploadListingImages = async (images: any[]) => {
  const formData = new FormData();

  images.forEach((img, index) => {
    formData.append("images", {
      uri: img.uri,
      name: `listing_${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const res = await API.post("/upload/listing", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data?.urls || res.data?.urls;
};

export const createListing = (data: any) => API.post("/listings", data);

export const fetchListings = (
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {},
) => API.get("/listings", { params });

export const fetchListingById = (id: string) => API.get(`/listings/${id}`);
