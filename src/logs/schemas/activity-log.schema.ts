import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, index: true })
  userId?: Types.ObjectId;

  @Prop()
  username?: string;

  @Prop()
  shopId?: string;

  @Prop()
  role?: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true, index: true })
  path: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ required: true })
  durationMs: number;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop({ type: Object })
  requestBody?: Record<string, unknown>;

  @Prop({ type: Object })
  query?: Record<string, unknown>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
ActivityLogSchema.index({ createdAt: -1 });
