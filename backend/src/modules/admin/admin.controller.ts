import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../common/enums/role.enum';
import { zodValidate } from '../../common/utils';
import {
  adminUserListQuerySchema,
  adminPendingPropertiesQuerySchema,
  adminIdParamSchema,
  suspendUserSchema,
  SuspendUserDto,
} from './dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('dashboard/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
  ) {
    const validated = zodValidate(adminUserListQuerySchema, { page, limit, role });
    return this.adminService.getUsers(
      parseInt(validated.page, 10),
      parseInt(validated.limit, 10),
      validated.role,
    );
  }

  @Put('users/:id/verify')
  @ApiOperation({ summary: 'Verify an agent' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async verifyAgent(@Param('id') id: string) {
    const validated = zodValidate(adminIdParamSchema, { id });
    return this.adminService.verifyAgent(validated.id);
  }

  @Put('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend or unsuspend a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: SuspendUserDto })
  async suspendUser(
    @Param('id') id: string,
    @Body() body: SuspendUserDto,
  ) {
    const validatedParam = zodValidate(adminIdParamSchema, { id });
    const validatedBody = zodValidate(suspendUserSchema, body);
    return this.adminService.suspendUser(validatedParam.id, validatedBody.suspend);
  }

  @Get('properties/pending')
  @ApiOperation({ summary: 'Get pending properties for review' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getPendingProperties(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const validated = zodValidate(adminPendingPropertiesQuerySchema, {
      page,
      limit,
    });
    return this.adminService.getPendingProperties(
      parseInt(validated.page, 10),
      parseInt(validated.limit, 10),
    );
  }

  @Put('properties/:id/approve')
  @ApiOperation({ summary: 'Approve a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  async approveProperty(@Param('id') id: string) {
    const validated = zodValidate(adminIdParamSchema, { id });
    return this.adminService.approveProperty(validated.id);
  }
}
