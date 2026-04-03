import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    phone?: string;
    avatar?: string;
    createdAt: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    avatar?: string;
}

export const userService = {
    /**
     * Get current user's profile information
     */
    async getProfile(): Promise<UserProfile> {
        const response: BackendResponse<UserProfile> = await apiClient.get('/users/me');
        return response.data;
    },

    /**
     * Update current user's profile
     */
    async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
        const response: BackendResponse<UserProfile> = await apiClient.put('/users/profile', data);
        return response.data;
    }
};
