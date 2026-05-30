import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { JwtCashierGuard } from '../auth/guards/jwt-cashier.guard';
import type { RequestUser } from '../auth/interfaces/request-user.interface';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtCashierGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @Message('Item added to cart successfully')
  @ApiOperation({
    summary: 'Add item to cart',
    description:
      'Adds a product to the authenticated cashier cart and recalculates totals.',
  })
  @ApiBody({ type: AddCartItemDto })
  @ApiOkResponse({ description: 'Item added to cart successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  addItem(@CurrentUser() user: RequestUser, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.id, dto);
  }

  @Patch('update-quantity')
  @Message('Cart item quantity updated successfully')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({ type: UpdateCartQuantityDto })
  @ApiOkResponse({ description: 'Cart item quantity updated successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  updateQuantity(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(user.id, dto);
  }

  @Delete('remove-item/:productId')
  @Message('Item removed from cart successfully')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiMongoIdParam('productId', 'Product id')
  @ApiOkResponse({ description: 'Item removed from cart successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  removeItem(
    @CurrentUser() user: RequestUser,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(user.id, productId);
  }

  @Delete('clear')
  @Message('Cart cleared successfully')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiOkResponse({ description: 'Cart cleared successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  clear(@CurrentUser() user: RequestUser) {
    return this.cartService.clearCart(user.id);
  }

  @Get()
  @Message('Cart fetched successfully')
  @ApiOperation({ summary: 'Get current cashier cart' })
  @ApiOkResponse({ description: 'Cart fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  getCart(@CurrentUser() user: RequestUser) {
    return this.cartService.getCart(user.id);
  }
}
