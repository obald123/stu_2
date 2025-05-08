import api from './api';
import { GoogleUserData, GoogleAuthResponse } from '../types/google';

export const verifyGoogleAuth = async (token: string, userData: GoogleUserData): Promise<GoogleAuthResponse> => {
  try {
    const response = await api.post<GoogleAuthResponse>('/api/auth/google/verify', { token, userData });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface GoogleRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
  dateOfBirth: string;
}

export const registerWithGoogle = async (userData: GoogleRegistrationData): Promise<{ user: GoogleAuthResponse['user']; token: string }> => {
  try {
    const response = await api.post('/api/auth/google/register', {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,      googleId: userData.googleId,
      dateOfBirth: userData.dateOfBirth
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
