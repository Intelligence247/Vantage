import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location?: {
        type: string;
        coordinates: number[];
    };
    address?: string;
    city?: string;
    area?: string;
    state?: string;
    type: string;
    category?: string;
    propertyKind?: string;
    features: string[];
    images: {
        url: string;
        publicId: string;
    }[];
    is360: boolean;
    status: string;
    agent: any;
    views: number;
    leads: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    parking?: number;
    yearBuilt?: number;
    isVerified: boolean;
    isFeatured: boolean;
    paymentPeriod?: string;
    nearbyPlaces: any[];
    favoritedBy: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface PropertyFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    category?: string;
    propertyKind?: string;
    status?: string;
    agent?: string;
    state?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export const propertyService = {
    /**
     * Get all properties with optional filters
     */
    async getAll(filters: PropertyFilters = {}): Promise<PaginatedProperties> {
        const response: BackendResponse<PaginatedProperties> = await apiClient.get('/properties', { params: filters });
        return response.data;
    },

    /**
     * Get featured properties
     */
    async getFeatured(limit: number = 6): Promise<Property[]> {
        const response: BackendResponse<Property[]> = await apiClient.get('/properties/featured', { params: { limit } });
        return response.data;
    },

    /**
     * Get a single property by ID
     */
    async getById(id: string): Promise<Property> {
        const response: BackendResponse<Property> = await apiClient.get(`/properties/${id}`);
        return response.data;
    },

    /**
     * Get user's favorite properties
     */
    async getFavorites(page: number = 1, limit: number = 20): Promise<PaginatedProperties> {
        const response: BackendResponse<PaginatedProperties> = await apiClient.get('/properties/favorites/me', { params: { page, limit } });
        return response.data;
    },

    /**
     * Toggle a property as favorite
     */
    async toggleFavorite(propertyId: string): Promise<{ isFavorited: boolean }> {
        const response: BackendResponse<{ isFavorited: boolean }> = await apiClient.post(`/properties/${propertyId}/favorite`);
        return response.data;
    },

    /**
     * Create a new property
     */
    async createProperty(propertyData: any): Promise<Property> {
        const response: BackendResponse<Property> = await apiClient.post('/properties', propertyData);
        return response.data;
    },

    /**
     * Update a property (Admin or Owner)
     */
    async updateProperty(
        propertyId: string,
        propertyData: Partial<Property> & { clearMapLocation?: boolean },
    ): Promise<Property> {
        const response: BackendResponse<Property> = await apiClient.put(`/properties/${propertyId}`, propertyData);
        return response.data;
    },

    /**
     * Delete a property (Admin or Owner)
     */
    async deleteProperty(propertyId: string): Promise<void> {
        await apiClient.delete(`/properties/${propertyId}`);
    },

    /**
     * Upload multiple property images
     */
    async uploadImages(files: File[]): Promise<Array<{ url: string; publicId: string }>> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response: BackendResponse<Array<{ url: string; publicId: string }>> = await apiClient.post(
            '/upload/images',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Upload a single image
     */
    async uploadSingleImage(file: File): Promise<{ url: string; publicId: string }> {
        const formData = new FormData();
        formData.append('image', file);

        const response: BackendResponse<{ url: string; publicId: string }> = await apiClient.post(
            '/upload/image',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Delete an image from Cloudinary
     */
    async deleteImage(publicId: string): Promise<void> {
        await apiClient.delete(`/upload/image/${publicId}`);
    },

    /**
     * Get agent's own properties
     */
    async getAgentProperties(page: number = 1, limit: number = 20): Promise<PaginatedProperties> {
        const response: BackendResponse<PaginatedProperties> = await apiClient.get('/properties/agent/me', { params: { page, limit } });
        return response.data;
    },

    /**
     * Get agent property stats
     */
    async getAgentStats(): Promise<any> {
        const response: BackendResponse<any> = await apiClient.get('/properties/agent/stats');
        return response.data;
    }
};
