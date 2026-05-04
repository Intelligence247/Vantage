import axios from 'axios';

type RefreshResponse = {
    accessToken: string;
    refreshToken: string;
};

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token && config.headers) {
                if (typeof config.headers.set === 'function') {
                    config.headers.set('Authorization', `Bearer ${token}`);
                } else {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally and unwrap data
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken =
                    typeof window !== 'undefined'
                        ? localStorage.getItem('refreshToken')
                        : null;

                if (!refreshToken) {
                    throw error;
                }

                const refreshBaseUrl =
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

                const refreshResponse = await axios.post(
                    `${refreshBaseUrl}/auth/refresh`,
                    { refreshToken },
                );

                const payload = refreshResponse.data?.data as RefreshResponse;
                if (!payload?.accessToken) {
                    throw error;
                }

                localStorage.setItem('accessToken', payload.accessToken);
                if (payload.refreshToken) {
                    localStorage.setItem('refreshToken', payload.refreshToken);
                }

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${payload.accessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
