import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser, JwtPayload, Public } from '../../common/decorators';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../common/enums/role.enum';
import {
  UpdateUserDto,
  ChangePasswordDto,
  UpdateNotificationPrefsDto,
  UploadKycDto,
  updateUserSchema,
  changePasswordSchema,
  updateNotificationPrefsSchema,
  uploadKycSchema,
} from './dto/user.dto';
import { zodValidate } from '../../common/utils';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserDto,
  ) {
    const validated = zodValidate(updateUserSchema, body);
    return this.usersService.update(user.sub, validated);
  }

  @Put('password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() body: ChangePasswordDto,
  ) {
    const validated = zodValidate(changePasswordSchema, body);
    await this.usersService.changePassword(user.sub, validated);
    return { message: 'Password changed successfully' };
  }

  @Put('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  async updateNotifications(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateNotificationPrefsDto,
  ) {
    const validated = zodValidate(updateNotificationPrefsSchema, body);
    return this.usersService.updateNotificationPreferences(
      user.sub,
      validated,
    );
  }

  @Put('kyc-document')
  @Roles(Role.AGENT)
  @ApiOperation({ summary: 'Upload KYC Document for verification' })
  async uploadKycDocument(
    @CurrentUser() user: JwtPayload,
    @Body() body: UploadKycDto,
  ) {
    const validated = zodValidate(uploadKycSchema, body);
    return this.usersService.uploadKycDocument(user.sub, validated);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all users (Public, filters by role)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      role,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get user by ID (Public)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
