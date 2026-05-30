import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { sanitizeLogData } from '../common/utils/sanitize-log-data.util';
import { ActivityLog } from './schemas/activity-log.schema';
import { ErrorLog } from './schemas/error-log.schema';

interface RequestLogData {
  user?: RequestUser;
  method: string;
  path: string;
  statusCode: number;
  durationMs?: number;
  message?: string;
  error?: string;
  stack?: string;
  ip?: string;
  userAgent?: string;
  requestBody?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLog>,
    @InjectModel(ErrorLog.name)
    private readonly errorLogModel: Model<ErrorLog>,
  ) {}

  async createActivityLog(data: RequestLogData) {
    return this.activityLogModel.create({
      ...this.getUserFields(data.user),
      method: data.method,
      path: data.path,
      statusCode: data.statusCode,
      durationMs: data.durationMs || 0,
      ip: data.ip,
      userAgent: data.userAgent,
      requestBody: sanitizeLogData(data.requestBody) as Record<string, unknown>,
      query: sanitizeLogData(data.query) as Record<string, unknown>,
    });
  }

  async createErrorLog(data: RequestLogData) {
    return this.errorLogModel.create({
      ...this.getUserFields(data.user),
      method: data.method,
      path: data.path,
      statusCode: data.statusCode,
      message: data.message || 'Unexpected error',
      error: data.error,
      stack: data.stack,
      ip: data.ip,
      userAgent: data.userAgent,
      requestBody: sanitizeLogData(data.requestBody) as Record<string, unknown>,
      query: sanitizeLogData(data.query) as Record<string, unknown>,
    });
  }

  async findActivityLogs(query: PaginationQueryDto) {
    return this.findPaginated(this.activityLogModel, query);
  }

  async findErrorLogs(query: PaginationQueryDto) {
    return this.findPaginated(this.errorLogModel, query);
  }

  private getUserFields(user?: RequestUser) {
    return {
      userId: user?.id ? new Types.ObjectId(user.id) : undefined,
      username: user?.username,
      shopId: user?.shopId,
      role: user?.role,
    };
  }

  private async findPaginated<T>(model: Model<T>, query: PaginationQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;
    const filter = query.search
      ? { path: { $regex: query.search, $options: 'i' } }
      : {};

    const [data, total] = await Promise.all([
      model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      model.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
