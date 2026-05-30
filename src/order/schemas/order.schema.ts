import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentMethod } from '../../common/enums/payment-method.enum';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { Product } from '../../product/schemas/product.schema';
import { Cashier } from '../../cashiers/schemas/cashier.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 0 })
  totalPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: Cashier.name, required: true, index: true })
  cashierId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0 })
  tax: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  grandTotal: number;

  @Prop({ enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ enum: OrderStatus, default: OrderStatus.COMPLETED })
  orderStatus: OrderStatus;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });
