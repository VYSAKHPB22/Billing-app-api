import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/schemas/cart.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CheckoutDto } from './dto/checkout.dto';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrderService extends BaseCrudService<Order> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly cartService: CartService,
  ) {
    super(orderModel, 'Order');
  }

  async checkout(cashierId: string, dto: CheckoutDto) {
    const cart = await this.cartModel
      .findOne({ cashierId: new Types.ObjectId(cashierId) })
      .exec();

    if (!cart?.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const discount = dto.discount || 0;

    if (discount > cart.subtotal + cart.tax) {
      throw new BadRequestException('Discount cannot exceed order total');
    }

    const order = await this.orderModel.create({
      orderNumber: await this.generateOrderNumber(),
      cashierId: new Types.ObjectId(cashierId),
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      discount,
      grandTotal: Number((cart.grandTotal - discount).toFixed(2)),
      paymentMethod: dto.paymentMethod,
      orderStatus: OrderStatus.COMPLETED,
    });

    await this.cartService.checkoutClear(cashierId);

    return {
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      grandTotal: order.grandTotal,
    };
  }

  findAllForUser(query: PaginationQueryDto, user: RequestUser) {
    const filter: Record<string, any> = {};

    if (user.role === UserRole.CASHIER) {
      filter.cashierId = new Types.ObjectId(user.id);
    }

    if (query.search) {
      filter.orderNumber = { $regex: query.search, $options: 'i' };
    }

    return super.findAll(query, filter, { path: 'cashierId' });
  }

  findOne(id: string) {
    return super.findOne(id, undefined, undefined, { path: 'cashierId' });
  }

  private async generateOrderNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;
    const startOfDay = new Date(year, now.getMonth(), now.getDate());
    const endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);

    const count = await this.orderModel
      .countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      })
      .exec();

    return `ORD-${datePart}-${String(count + 1).padStart(4, '0')}`;
  }
}
