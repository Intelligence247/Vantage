import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';
import { Property } from './property.service';

export interface Inquiry {
    _id: string;
    property: Property | string;
    name: string;
    email: string;
    phone: string;
    message: string;
    type: string;
    status: string;
    createdAt: string;
    user?: string;
    agent?: string;
}

export interface PaginatedInquiries {
    inquiries: Inquiry[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export const inquiryService = {
    /**
     * Get inbox messages (inquiries)
     */
    async getInbox(page: number = 1, limit: number = 20): Promise<PaginatedInquiries> {
        const response: BackendResponse<PaginatedInquiries> = await apiClient.get('/inbox', { params: { page, limit } });
        return response.data;
    },

    /**
     * Send an inquiry (authenticated)
     */
    async createInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post('/inquiries', data);
        return response.data;
    },

    /**
     * Send a property-specific inquiry (public)
     */
    async createPropertyInquiry(propertyId: string, data: Partial<Inquiry>): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post(`/properties/${propertyId}/inquiry`, data);
        return response.data;
    }
};
