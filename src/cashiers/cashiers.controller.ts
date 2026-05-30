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
import { CashiersService } from './cashiers.service';

@ApiTags('Cashiers')
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller('cashiers')
export class CashiersController {
  constructor(private readonly cashiersService: CashiersService) {}

  @Get()
  @Message('Cashiers fetched successfully')
  @ApiOperation({
    summary: 'List cashiers',
    description: 'Returns cashiers that belong to the authenticated admin shop.',
  })
  @ApiPaginationQueries('Search by cashier name')
  @ApiOkResponse({ description: 'Cashiers fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(@Query() query: PaginationQueryDto, @CurrentUser() user: RequestUser) {
    return this.cashiersService.findAllByShop(query, user.shopId);
  }

  @Get(':id')
  @Message('Cashier fetched successfully')
  @ApiOperation({ summary: 'Get cashier by id' })
  @ApiMongoIdParam('id', 'Cashier id')
  @ApiOkResponse({ description: 'Cashier fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.cashiersService.findOneByShop(id, user.shopId);
  }
}
