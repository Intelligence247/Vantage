import axios from 'axios';

// Base Axios instance
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
    (config) => {
        // Only access localStorage on the client
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
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
        // The NestJS backend wraps responses in { success: true, data: { ... } }
        // We unwrap it here so services get the expected data shape
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 Unauthorized (invalid/expired token)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using the refresh token
                // Note: Refresh logic implementation will depend on how you store the refresh token (e.g., httpOnly cookie)
                // const refreshToken = localStorage.getItem('refreshToken');
                // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
                // const { accessToken } = response.data;
                // localStorage.setItem('accessToken', accessToken);
                // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                // return apiClient(originalRequest);

                // If refresh fails, you might want to force logout:
                // localStorage.removeItem('accessToken');
                // window.location.href = '/login';
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // You can parse specific backend error shapes here (e.g. error.response.data.message)
        return Promise.reject(error);
    }
);
