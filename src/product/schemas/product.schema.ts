import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubCategory } from '../../sub-category/schemas/sub-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: Types.ObjectId,
    ref: SubCategory.name,
    required: true,
    index: true,
  })
  subCategoryId: Types.ObjectId;

  @Prop()
  image?: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 1, deletedAt: 1 });
