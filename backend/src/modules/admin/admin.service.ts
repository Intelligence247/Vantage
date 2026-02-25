import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from '../users/users.service';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly propertiesService: PropertiesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getDashboardStats(): Promise<{
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
  }> {
    const [userStats, propertyStats] = await Promise.all([
      this.usersService.getUserStats(),
      this.propertiesService.getPropertyStats(),
    ]);

    return {
      users: userStats,
      properties: propertyStats,
    };
  }

  async verifyAgent(userId: string) {
    const user = await this.usersService.verifyAgent(userId);
    this.logger.info('Admin verified agent', { userId });
    return user;
  }

  async suspendUser(userId: string, suspend: boolean) {
    const user = await this.usersService.suspendUser(userId, suspend);
    this.logger.info(`Admin ${suspend ? 'suspended' : 'unsuspended'} user`, {
      userId,
    });
    return user;
  }

  async getUsers(page = 1, limit = 20, role?: string) {
    return this.usersService.findAll(page, limit, role);
  }

  async getPendingProperties(page = 1, limit = 20) {
    return this.propertiesService.getPendingProperties(page, limit);
  }

  async approveProperty(propertyId: string) {
    const property = await this.propertiesService.approveProperty(propertyId);
    this.logger.info('Admin approved property', { propertyId });
    return property;
  }
}
