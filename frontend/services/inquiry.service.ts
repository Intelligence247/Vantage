import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';
import { Property } from './property.service';

export interface Inquiry {
    id?: string;
    _id?: string;
    property: Property | string;
    name: string;
    email: string;
    phone: string;
    message: string;
    type: string;
    status: string;
    messages?: Array<{
        sender?: string | { id?: string; _id?: string; name?: string; email?: string };
        senderRole: "buyer" | "agent" | "admin";
        body: string;
        createdAt: string;
    }>;
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

export interface CreateInquiryPayload {
    propertyId: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
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
    async createInquiry(data: CreateInquiryPayload): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post('/inquiries', data);
        return response.data;
    },

    /**
     * Send a property-specific inquiry (public)
     */
    async createPropertyInquiry(propertyId: string, data: Omit<CreateInquiryPayload, "propertyId">): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post(`/properties/${propertyId}/inquiry`, data);
        return response.data;
    },

    /**
     * Submit the public contact form
     */
    async submitContactForm(data: any): Promise<any> {
        const response: BackendResponse<any> = await apiClient.post('/contact', data);
        return response.data;
    },

    /**
     * Get single inquiry loop details
     */
    async getInquiryById(id: string): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.get(`/inquiries/${id}`);
        return response.data;
    },

    /**
     * Update an inquiry status (Agent/Admin)
     */
    async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post(`/inquiries/${id}/status`, { status });
        return response.data;
    },

    async replyToInquiry(id: string, message: string): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post(`/inquiries/${id}/reply`, { message });
        return response.data;
    },

    async sendMessage(id: string, message: string): Promise<Inquiry> {
        const response: BackendResponse<Inquiry> = await apiClient.post(`/inquiries/${id}/messages`, { message });
        return response.data;
    },
};
