export enum Role {
    ADMIN = "admin",
    STUDENT = "student"
}

export interface UserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date
    role: Role;
}

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    registrationNumber: string;
    dateOfBirth: Date;
    role: Role;
    qrCode?: string;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UsersListResponse {
  users: UserResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  message: string;
  token?: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: UserResponse;
  token: string;
}
