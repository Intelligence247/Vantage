import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';

export interface UserProfile {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    phone?: string;
    avatar?: string;
    verificationDocument?: string;
    verificationDocPublicId?: string;
    notificationPreferences?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
    };
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
    },

    /**
     * Get all users (Admin only)
     */
    async getAllUsers(page: number = 1, limit: number = 20, role?: string): Promise<{ users: UserProfile[], total: number, pages: number }> {
        const params: any = { page, limit };
        if (role) params.role = role;
        const response: BackendResponse<any> = await apiClient.get('/users', { params });
        return response.data;
    },

    /**
     * Get a specific user by ID (Public)
     */
    async getUserById(id: string): Promise<UserProfile> {
        const response: BackendResponse<UserProfile> = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    /**
     * Update current user's password
     */
    async updatePassword(data: { currentPassword: string, newPassword: string }): Promise<void> {
        const response: BackendResponse<void> = await apiClient.put('/users/password', data);
        return response.data;
    },

    /**
     * Update current user's notification preferences
     */
    async updateNotifications(data: { email?: boolean; push?: boolean; sms?: boolean }): Promise<void> {
        const response: BackendResponse<void> = await apiClient.put('/users/notifications', data);
        return response.data;
    },

    async uploadKycDocument(data: { verificationDocument: string; verificationDocPublicId?: string }): Promise<UserProfile> {
        const response: BackendResponse<UserProfile> = await apiClient.put('/users/kyc-document', data);
        return response.data;
    },
};
