/**
 * Shared TypeScript types used across frontend and API documentation
 * These types define the API contract between frontend and backend
 */

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface ApiPagedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  locationLatitude: number;
  locationLongitude: number;
  sports: Sport[];
  skillLevel: SkillLevel;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sports: string[];
  skillLevel: SkillLevel;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Sport Types
export interface Sport {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Professional = 'Professional',
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  sport: Sport;
  dateTime: string;
  locationLatitude: number;
  locationLongitude: number;
  maxParticipants?: number;
  currentParticipants: number;
  organizer: UserProfile;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  sportId: string;
  dateTime: string;
  locationLatitude: number;
  locationLongitude: number;
  maxParticipants?: number;
  isPublic: boolean;
}

// Marketplace Types
export interface Listing {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  price: number;
  images: string[];
  seller: UserProfile;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ListingStatus {
  Available = 'Available',
  Sold = 'Sold',
  Removed = 'Removed',
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string;
}

// Post/Feed Types
export interface Post {
  id: string;
  authorId: string;
  author: UserProfile;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: UserProfile;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
