import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';
import { Shop } from '../../shops/schemas/shop.schema';

export type CashierDocument = HydratedDocument<Cashier>;

@Schema({ timestamps: true, collection: 'cashiers' })
export class Cashier {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Shop.name, required: true, index: true })
  shopId: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.CASHIER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const CashierSchema = SchemaFactory.createForClass(Cashier);
CashierSchema.index({ username: 1, deletedAt: 1 });
