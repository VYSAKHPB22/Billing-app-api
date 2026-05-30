import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../logs/logs.service';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { sanitizeLogData } from '../utils/sanitize-log-data.util';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const startedAt = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      tap(() => {
        if (this.shouldSkip(request.url)) {
          return;
        }

        void this.logsService
          .createActivityLog({
            user: request.user as RequestUser | undefined,
            method: request.method,
            path: request.url,
            statusCode: response.statusCode,
            durationMs: Date.now() - startedAt,
            ip: request.ip,
            userAgent: request.headers?.['user-agent'],
            requestBody: sanitizeLogData(request.body) as Record<string, unknown>,
            query: sanitizeLogData(request.query) as Record<string, unknown>,
          })
          .catch((error) => console.error('Activity log failed:', error));
      }),
    );
  }

  private shouldSkip(path: string): boolean {
    return path.startsWith('/api/docs') || path === '/favicon.ico';
  }
}
