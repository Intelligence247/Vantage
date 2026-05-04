import { apiClient } from '../lib/api-client';

// Standardized way to consume APIs
// We define our request and response structures (Can import these from a types file later)
export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        isVerified: boolean;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface BackendResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export interface VerifyEmailPayload {
    email: string;
    token: string;
}

export const authService = {
    /**
     * Register a new user
     */
    async register(data: any): Promise<AuthResponse> {
        // apiClient interceptor returns the JSON body (BackendResponse), so we access .data again
        const response: BackendResponse<AuthResponse> = await apiClient.post('/auth/register', data);
        return response.data;
    },

    /**
     * Login user and get tokens
     */
    async login(data: LoginPayload): Promise<AuthResponse> {
        const response: BackendResponse<AuthResponse> = await apiClient.post('/auth/login', data);
        return response.data;
    },

    /**
     * Log out user
     */
    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },

    async verifyEmail(data: VerifyEmailPayload): Promise<{ message: string }> {
        const response: BackendResponse<{ message: string }> = await apiClient.post('/auth/verify-email', data);
        return response.data;
    },

    /**
     * Get current user profile
     */
    async getCurrentUser() {
        const response: BackendResponse<any> = await apiClient.get('/users/me');
        return response.data;
    }
};
