export type Role = 'admin' | 'student';

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
    password?: string; // Make password optional
    registrationNumber: string;
    dateOfBirth: Date;
    role: Role;
    googleId?: string | null;
    qrCode?: string;
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

export interface GoogleUserData {
  email: string;
  given_name: string;
  family_name: string;
  sub: string;
  picture?: string;
}

export interface GoogleTokenVerifyRequest {
  token: string;
  userData: GoogleUserData;
}

export interface GoogleRegistrationRequest {
  token: string;
  userData: GoogleUserData;
  dateOfBirth: string;
}
