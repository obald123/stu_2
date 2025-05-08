export interface GoogleUserData {
  email: string;
  given_name: string;
  family_name: string;
  sub: string; // Google's unique identifier
  picture?: string;
}

export interface GoogleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  role: string;
  dateOfBirth?: string;
  googleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleAuthResponse {
  exists: boolean;
  user?: GoogleUser;
  token?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface GoogleRegistrationResult {
  token: string;
  user: GoogleUser;
  message: string;
}
