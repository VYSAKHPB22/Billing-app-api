import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Message } from '../common/decorators/message.decorator';
import {
  ApiMongoIdParam,
  ApiPaginationQueries,
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtCashierGuard } from '../auth/guards/jwt-cashier.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderService } from './order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @UseGuards(JwtCashierGuard)
  @Message('Checkout completed successfully')
  @ApiOperation({
    summary: 'Checkout current cart and generate bill',
    description:
      'Creates an order from the cashier cart, generates an order number, and clears the cart.',
  })
  @ApiBody({ type: CheckoutDto })
  @ApiOkResponse({ description: 'Checkout completed successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  checkout(@CurrentUser() user: RequestUser, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Message('Orders fetched successfully')
  @ApiOperation({ summary: 'List orders' })
  @ApiPaginationQueries('Search by order number')
  @ApiOkResponse({ description: 'Orders fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(
    @Query() query: PaginationQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.orderService.findAllForUser(query, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Message('Order fetched successfully')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiMongoIdParam('id', 'Order id')
  @ApiOkResponse({ description: 'Order fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Order deleted successfully')
  @ApiOperation({ summary: 'Soft delete order' })
  @ApiMongoIdParam('id', 'Order id')
  @ApiOkResponse({ description: 'Order deleted successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  remove(@Param('id') id: string) {
    return this.orderService.softDelete(id);
  }
}
