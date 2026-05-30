import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../category/schemas/category.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
SubCategorySchema.index({ name: 1, deletedAt: 1 });
