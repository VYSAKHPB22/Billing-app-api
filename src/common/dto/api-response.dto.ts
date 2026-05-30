export interface ApiResponseModel<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  path: string;
  timestamp: string;
}

export interface ApiErrorResponseModel {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  details?: unknown;
  path: string;
  timestamp: string;
}
