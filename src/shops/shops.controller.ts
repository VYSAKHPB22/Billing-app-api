import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Message } from '../common/decorators/message.decorator';
import {
  ApiMongoIdParam,
  ApiPaginationQueries,
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import { ShopsService } from './shops.service';

@ApiTags('Shops')
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @Message('Shops fetched successfully')
  @ApiOperation({
    summary: 'List shops',
    description: 'Returns paginated shops. Admin only.',
  })
  @ApiPaginationQueries('Search by shop name')
  @ApiOkResponse({ description: 'Shops fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.shopsService.findAll(query);
  }

  @Get(':id')
  @Message('Shop fetched successfully')
  @ApiOperation({ summary: 'Get shop by id' })
  @ApiMongoIdParam('id', 'Shop id')
  @ApiOkResponse({ description: 'Shop fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }
}
