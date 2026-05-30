import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
  @Prop({ required: true, trim: true, index: true })
  shopName: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  shopEmail: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
ShopSchema.index({ shopEmail: 1, deletedAt: 1 });
