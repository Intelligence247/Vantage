import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';

export interface Property {
    _id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    propertyKind: string;
    status: string;
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    size: number;
    sizeUnit: string;
    furnishing: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    features: string[];
    images: {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }[];
    agent: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        isVerified: boolean;
    };
    views: number;
    likes: number;
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
    }
};
