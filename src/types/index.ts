// ============================
// TypeScript Interfaces
// ============================

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  avatar?: string;
  enrolledCourses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICourse {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  instructor: IUser | string;
  duration: string;
  lessons: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  user: IUser | string;
  course: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IPayment {
  _id: string;
  user: string;
  course: string;
  amount: number;
  transactionId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: Omit<IUser, "password">;
}

export interface StatsData {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalReviews: number;
}

// Filter types for courses page
export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

// Course categories
export const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Cloud Computing",
  "Cyber Security",
  "Digital Marketing",
] as const;

export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
