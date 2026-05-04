import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';
import type { Property } from './property.service';

export interface PurchaseRecord {
    id?: string;
    _id?: string;
    reference: string;
    amount: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    property: Property | string;
    vendor?: {
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
    };
}

export const paymentService = {
    async initialize(propertyId: string): Promise<{ authorizationUrl: string; reference: string }> {
        const response: BackendResponse<{ authorizationUrl: string; reference: string }> = await apiClient.post(
            `/payments/initialize/${propertyId}`,
        );
        return response.data;
    },

    async verify(reference: string): Promise<{ status: string; message: string }> {
        const response: BackendResponse<{ status: string; message: string }> = await apiClient.get(
            `/payments/verify/${reference}`,
        );
        return response.data;
    },

    /** Successful purchases (payment settled) for the signed-in buyer */
    async getPurchases(): Promise<PurchaseRecord[]> {
        const response: BackendResponse<PurchaseRecord[]> = await apiClient.get('/payments/purchases');
        return response.data;
    },
};
