import axios from "axios";
import { getToken } from "./storage";

const BASE_URL = "http://192.168.1.5:5000/api";

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
