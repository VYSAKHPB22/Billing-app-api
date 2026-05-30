import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ErrorLogDocument = HydratedDocument<ErrorLog>;

@Schema({ timestamps: true })
export class ErrorLog {
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
  message: string;

  @Prop()
  error?: string;

  @Prop()
  stack?: string;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop({ type: Object })
  requestBody?: Record<string, unknown>;

  @Prop({ type: Object })
  query?: Record<string, unknown>;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
ErrorLogSchema.index({ createdAt: -1 });
