import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Message } from '../common/decorators/message.decorator';
import {
  ApiMongoIdParam,
  ApiPaginationQueries,
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BusinessAdminsService } from './business-admins.service';

@ApiTags('Business Admins')
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller('business-admins')
export class BusinessAdminsController {
  constructor(private readonly businessAdminsService: BusinessAdminsService) {}

  @Get()
  @Message('Business admins fetched successfully')
  @ApiOperation({
    summary: 'List business admins',
    description: 'Returns admins that belong to the authenticated admin shop.',
  })
  @ApiPaginationQueries('Search by admin name')
  @ApiOkResponse({ description: 'Business admins fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(@Query() query: PaginationQueryDto, @CurrentUser() user: RequestUser) {
    console.log('Fetching business admins for shopId:', user.shopId);
    return this.businessAdminsService.findAllByShop(query, user.shopId);
  }

  @Get(':id')
  @Message('Business admin fetched successfully')
  @ApiOperation({ summary: 'Get business admin by id' })
  @ApiMongoIdParam('id', 'Business admin id')
  @ApiOkResponse({ description: 'Business admin fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.businessAdminsService.findOneByShop(id, user.shopId);
  }
}
