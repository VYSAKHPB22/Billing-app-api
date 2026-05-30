import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LogsService } from '../../logs/logs.service';
import { ApiErrorResponseModel } from '../dto/api-response.dto';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { sanitizeLogData } from '../utils/sanitize-log-data.util';

interface NormalizedError {
  statusCode: number;
  message: string | string[];
  error: string;
  details?: unknown;
}

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const normalizedError = this.normalizeException(exception);
    const timestamp = new Date().toISOString();

    void this.logsService
      .createErrorLog({
        user: request.user as RequestUser | undefined,
        method: request.method,
        path: request.url,
        statusCode: normalizedError.statusCode,
        message: Array.isArray(normalizedError.message)
          ? normalizedError.message.join(', ')
          : normalizedError.message,
        error: normalizedError.error,
        stack: exception instanceof Error ? exception.stack : undefined,
        ip: request.ip,
        userAgent: request.headers?.['user-agent'],
        requestBody: sanitizeLogData(request.body) as Record<string, unknown>,
        query: sanitizeLogData(request.query) as Record<string, unknown>,
      })
      .catch((logError) => console.error('Error log failed:', logError));

    console.error('ERROR:', {
      path: request.url,
      method: request.method,
      status: normalizedError.statusCode,
      error: normalizedError.message,
      timestamp,
    });

    const body: ApiErrorResponseModel = {
      success: false,
      statusCode: normalizedError.statusCode,
      message: normalizedError.message,
      error: normalizedError.error,
      details: normalizedError.details,
      path: request.url,
      timestamp,
    };

    response.status(normalizedError.statusCode).json(body);
  }

  private normalizeException(exception: unknown): NormalizedError {
    if (exception instanceof HttpException) {
      return this.normalizeHttpException(exception);
    }

    if (this.isMongoDuplicateKeyError(exception)) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Duplicate record already exists',
        error: 'Conflict',
        details: this.getDuplicateKeyDetails(exception),
      };
    }

    if (this.isMongooseValidationError(exception)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'Bad Request',
        details: this.getMongooseValidationDetails(exception),
      };
    }

    if (this.isMongooseCastError(exception)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid resource id',
        error: 'Bad Request',
      };
    }

    if (this.isJwtError(exception)) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message:
          this.getErrorName(exception) === 'TokenExpiredError'
            ? 'Token expired'
            : 'Invalid token',
        error: 'Unauthorized',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };
  }

  private normalizeHttpException(exception: HttpException): NormalizedError {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        statusCode,
        message: response,
        error: this.getHttpErrorName(statusCode),
      };
    }

    const errorResponse = response as {
      message?: string | string[];
      error?: string;
      details?: unknown;
    };

    return {
      statusCode,
      message: errorResponse.message || exception.message,
      error: errorResponse.error || this.getHttpErrorName(statusCode),
      details: errorResponse.details,
    };
  }

  private getHttpErrorName(statusCode: number): string {
    return (
      Object.entries(HttpStatus).find(([, value]) => value === statusCode)?.[0]
        ?.split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ') || 'Error'
    );
  }

  private isMongoDuplicateKeyError(exception: unknown): exception is {
    code: number;
    keyValue?: Record<string, unknown>;
  } {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as { code?: number }).code === 11000
    );
  }

  private getDuplicateKeyDetails(exception: {
    keyValue?: Record<string, unknown>;
  }) {
    return exception.keyValue
      ? sanitizeLogData(exception.keyValue)
      : undefined;
  }

  private isMongooseValidationError(exception: unknown): exception is {
    name: string;
    errors: Record<string, { message: string }>;
  } {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      this.getErrorName(exception) === 'ValidationError' &&
      'errors' in exception
    );
  }

  private getMongooseValidationDetails(exception: {
    errors: Record<string, { message: string }>;
  }) {
    return Object.entries(exception.errors).map(([field, error]) => ({
      field,
      message: error.message,
    }));
  }

  private isMongooseCastError(exception: unknown): boolean {
    return this.getErrorName(exception) === 'CastError';
  }

  private isJwtError(exception: unknown): boolean {
    return ['JsonWebTokenError', 'TokenExpiredError'].includes(
      this.getErrorName(exception),
    );
  }

  private getErrorName(exception: unknown): string {
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'name' in exception
    ) {
      return String((exception as { name?: string }).name);
    }

    return '';
  }
}
