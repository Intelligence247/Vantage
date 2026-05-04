import { apiClient } from '../lib/api-client';
import { BackendResponse } from './auth.service';
import { Property, PaginatedProperties } from './property.service';
import { UserProfile } from './user.service';

export interface AdminStats {
  users: {
    totalUsers: number;
    totalAgents: number;
    verifiedAgents: number;
    pendingVerifications: number;
  };
  properties: {
    totalProperties: number;
    activeProperties: number;
    pendingProperties: number;
    soldProperties: number;
    totalViews: number;
    totalLeads: number;
  };
}

export interface PaginatedUsers {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const adminService = {
  /**
   * Get admin dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    const response: BackendResponse<AdminStats> = await apiClient.get('/dashboard/admin/stats');
    return response.data;
  },

  /**
   * Get all users (Admin only)
   */
  async getUsers(page: number = 1, limit: number = 20, role?: string): Promise<PaginatedUsers> {
    const params: any = { page, limit };
    if (role) params.role = role;
    const response: BackendResponse<PaginatedUsers> = await apiClient.get('/dashboard/admin/users', { params });
    return response.data;
  },

  /**
   * Verify an agent
   */
  async verifyAgent(userId: string): Promise<any> {
    const response: BackendResponse<any> = await apiClient.put(`/dashboard/admin/users/${userId}/verify`);
    return response.data;
  },

  /**
   * Suspend or unsuspend a user
   */
  async suspendUser(userId: string, suspend: boolean): Promise<any> {
    const response: BackendResponse<any> = await apiClient.put(`/dashboard/admin/users/${userId}/suspend`, { suspend });
    return response.data;
  },

  /**
   * Get pending properties for review
   */
  async getPendingProperties(page: number = 1, limit: number = 20): Promise<PaginatedProperties> {
    const response: BackendResponse<PaginatedProperties> = await apiClient.get('/dashboard/admin/properties/pending', { params: { page, limit } });
    return response.data;
  },

  /**
   * Approve a property
   */
  async approveProperty(propertyId: string): Promise<any> {
    const response: BackendResponse<any> = await apiClient.put(`/dashboard/admin/properties/${propertyId}/approve`);
    return response.data;
  }
};
