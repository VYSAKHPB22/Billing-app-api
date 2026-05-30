import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true, index: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ name: 1, deletedAt: 1 });
