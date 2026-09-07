export type UserRole = "user" | "admin";

export interface User {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  profession?: string;
  isVerified?: boolean;
  userRole?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface Post {
  _id: string;
  author: User | string;
  description: string;
  tags?: string[];
  images?: string[];
  isPinned?: boolean;
  likesCount?: number;
  commentsCount?: number;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  postId: string;
  author: User | string;
  text: string;
  parentCommentId?: string | null;
  likesCount?: number;
  replies?: Comment[];
  createdAt?: string;
}

export interface ListingLocation {
  address: string;
  city?: string;
  state?: string;
  coordinates?: [number, number];
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  category: string;
  price?: number | string;
  listingType?: "Free" | "Donate" | "Sell";
  condition?: string;
  images?: string[];
  location?: string | ListingLocation;
  address?: string;
  contactMethod?: "phone" | "email" | "both";
  phone?: string;
  email?: string;
  currency?: string;
  status?: "pending" | "approved" | "rejected";
  author?: User | string;
  userName?: string;
  userProfession?: string;
  userImage?: string;
  createdAt?: string;
}

export interface Portfolio {
  _id: string;
  user?: User | string;
  profession?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  experience?: string;
  hourlyRate?: string | number;
  gallery?: string[];
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  isAvailable?: boolean;
}

export interface Review {
  _id: string;
  reviewer: User | string;
  professional: User | string;
  rating: number;
  comment: string;
  projectTags?: string[];
  createdAt?: string;
}

export interface DocumentRecord {
  _id: string;
  title: string;
  templateType: string;
  data?: Record<string, any>;
  formData?: Record<string, any>;
  designStyle?: string;
  pdfUrl?: string;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  posts?: any;
  totalPages?: number;
  portfolios?: any;
  user?: any;
  [key: string]: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
