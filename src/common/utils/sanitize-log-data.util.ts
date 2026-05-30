const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
]);

export function sanitizeLogData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLogData(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (sanitized, [key, item]) => {
      sanitized[key] = SENSITIVE_KEYS.has(key) ? '[REDACTED]' : sanitizeLogData(item);
      return sanitized;
    },
    {} as Record<string, unknown>,
  );
}
