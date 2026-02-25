import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { PropertiesService } from './properties.service';
import { CurrentUser, JwtPayload, Roles, Public } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../common/enums/role.enum';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  PropertyType,
  PropertyCategory,
  PropertyKind,
  PropertyStatus,
} from './dto/property.dto';
import { zodValidate } from '../../common/utils';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all properties with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false, enum: PropertyType })
  @ApiQuery({ name: 'category', required: false, enum: PropertyCategory })
  @ApiQuery({ name: 'propertyKind', required: false, enum: PropertyKind })
  @ApiQuery({ name: 'status', required: false, enum: PropertyStatus })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'beds', required: false })
  @ApiQuery({ name: 'baths', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: PropertyType,
    @Query('category') category?: PropertyCategory,
    @Query('propertyKind') propertyKind?: PropertyKind,
    @Query('status') status?: PropertyStatus,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('beds') beds?: string,
    @Query('baths') baths?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const validated = zodValidate(propertyQuerySchema, {
      page,
      limit,
      search,
      type,
      category,
      propertyKind,
      status,
      state,
      city,
      minPrice,
      maxPrice,
      beds,
      baths,
      sort,
      order,
    });
    return this.propertiesService.findAll(validated);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured properties' })
  @ApiQuery({ name: 'limit', required: false })
  async getFeatured(@Query('limit') limit?: string) {
    return this.propertiesService.findFeatured(
      limit ? parseInt(limit, 10) : 6,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property (Agent/Admin only)' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreatePropertyDto,
  ) {
    const validated = zodValidate(createPropertySchema, body);
    return this.propertiesService.create(user.sub, validated);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdatePropertyDto,
  ) {
    const validated = zodValidate(updatePropertySchema, body);
    const isAdmin = user.role === Role.ADMIN;
    return this.propertiesService.update(id, user.sub, validated, isAdmin);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    const isAdmin = user.role === Role.ADMIN;
    await this.propertiesService.delete(id, user.sub, isAdmin);
    return { message: 'Property deleted successfully' };
  }

  @Post(':id/favorite')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle property favorite' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  async toggleFavorite(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.propertiesService.toggleFavorite(id, user.sub);
  }

  @Get('favorites/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my favorite properties' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getFavorites(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.propertiesService.getFavorites(
      user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('agent/me')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get agent's own properties" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMyProperties(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.propertiesService.findByAgent(
      user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('agent/stats')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent property stats' })
  async getAgentStats(@CurrentUser() user: JwtPayload) {
    return this.propertiesService.getPropertyStats(user.sub);
  }
}
