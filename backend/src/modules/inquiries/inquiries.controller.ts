import {
  Controller,
  Get,
  Post,
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
import { InquiriesService } from './inquiries.service';
import {
  CreateInquiryDto,
  ContactFormDto,
  createInquirySchema,
  contactFormSchema,
} from './dto/inquiry.dto';
import { CurrentUser, JwtPayload, Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../common/enums/role.enum';
import { zodValidate } from '../../common/utils';

@ApiTags('Inquiries')
@Controller()
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Public()
  @Post('properties/:id/inquiry')
  @ApiOperation({ summary: 'Send an inquiry about a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  async createInquiry(
    @Param('id') propertyId: string,
    @Body() body: CreateInquiryDto,
  ) {
    const validated = zodValidate(createInquirySchema, {
      ...body,
      propertyId,
    });
    return this.inquiriesService.createInquiry(validated);
  }

  @Post('inquiries')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send an inquiry (authenticated)' })
  async createAuthenticatedInquiry(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateInquiryDto,
  ) {
    const validated = zodValidate(createInquirySchema, body);
    return this.inquiriesService.createInquiry(validated, user.sub);
  }

  @Public()
  @Post('contact')
  @ApiOperation({ summary: 'Submit contact form' })
  async contact(@Body() body: ContactFormDto) {
    const validated = zodValidate(contactFormSchema, body);
    return this.inquiriesService.createContactMessage(validated);
  }

  @Get('inbox')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inbox messages' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getInbox(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (user.role === Role.AGENT) {
      return this.inquiriesService.getAgentInquiries(
        user.sub,
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 20,
      );
    }
    return this.inquiriesService.getUserInquiries(
      user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('inquiries/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiParam({ name: 'id', description: 'Inquiry ID' })
  async findOne(@Param('id') id: string) {
    return this.inquiriesService.getInquiryById(id);
  }

  @Post('inquiries/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status' })
  @ApiParam({ name: 'id', description: 'Inquiry ID' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.inquiriesService.updateInquiryStatus(id, status);
  }
}
