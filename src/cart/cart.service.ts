import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../product/schemas/product.schema';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly configService: ConfigService,
  ) {}

  async getCart(cashierId: string): Promise<CartDocument> {
    return this.getOrCreateCart(cashierId);
  }

  async addItem(cashierId: string, dto: AddCartItemDto): Promise<CartDocument> {
    const [cart, product] = await Promise.all([
      this.getOrCreateCart(cashierId),
      this.productModel
        .findOne({ _id: dto.productId, deletedAt: null, isAvailable: true })
        .exec(),
    ]);

    if (!product) {
      throw new NotFoundException('Product not found or unavailable');
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === dto.productId,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      existingItem.unitPrice = product.price;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(dto.productId),
        productName: product.name,
        quantity: dto.quantity,
        unitPrice: product.price,
        totalPrice: dto.quantity * product.price,
      });
    }

    return this.recalculateAndSave(cart);
  }

  async updateQuantity(
    cashierId: string,
    dto: UpdateCartQuantityDto,
  ): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(cashierId);
    const item = cart.items.find(
      (cartItem) => cartItem.productId.toString() === dto.productId,
    );

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = dto.quantity;
    item.totalPrice = item.quantity * item.unitPrice;

    return this.recalculateAndSave(cart);
  }

  async removeItem(cashierId: string, productId: string): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(cashierId);
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    if (cart.items.length === initialLength) {
      throw new NotFoundException('Cart item not found');
    }

    return this.recalculateAndSave(cart);
  }

  async clearCart(cashierId: string): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(cashierId);
    cart.items = [];
    return this.recalculateAndSave(cart);
  }

  async checkoutClear(cashierId: string) {
    await this.cartModel
      .findOneAndUpdate(
        { cashierId: new Types.ObjectId(cashierId) },
        { items: [], subtotal: 0, tax: 0, grandTotal: 0 },
      )
      .exec();
  }

  private async getOrCreateCart(cashierId: string): Promise<CartDocument> {
    let cart = await this.cartModel
      .findOne({ cashierId: new Types.ObjectId(cashierId) })
      .exec();

    if (!cart) {
      cart = await this.cartModel.create({
        cashierId: new Types.ObjectId(cashierId),
      });
    }

    return cart;
  }

  private async recalculateAndSave(cart: CartDocument): Promise<CartDocument> {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstPercent = Number(this.configService.get('GST_PERCENT') || 5);

    if (Number.isNaN(gstPercent) || gstPercent < 0) {
      throw new BadRequestException('Invalid GST_PERCENT configuration');
    }

    cart.tax = Number(((cart.subtotal * gstPercent) / 100).toFixed(2));
    cart.grandTotal = Number((cart.subtotal + cart.tax).toFixed(2));

    return cart.save();
  }
}
