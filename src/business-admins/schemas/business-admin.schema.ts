import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';
import { Shop } from '../../shops/schemas/shop.schema';

export type BusinessAdminDocument = HydratedDocument<BusinessAdmin>;

@Schema({ timestamps: true, collection: 'business_admins' })
export class BusinessAdmin {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Shop.name, required: true, index: true })
  shopId: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const BusinessAdminSchema = SchemaFactory.createForClass(BusinessAdmin);
BusinessAdminSchema.index({ username: 1, deletedAt: 1 });
