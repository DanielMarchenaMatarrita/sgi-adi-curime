import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const CORS_METHODS = ['GET', 'POST', 'PATCH'];
const CORS_HEADERS = ['Authorization', 'Content-Type'];

function configurationError(message: string): Error {
  return new Error(`Invalid CORS_ORIGINS configuration: ${message}`);
}

export function parseCorsOrigins(value: string | undefined): string[] {
  if (value === undefined || value.trim() === '') {
    throw configurationError('a non-empty value is required');
  }

  const origins = value.split(',').map((origin) => origin.trim());
  const parsedOrigins = new Set<string>();

  origins.forEach((origin, index) => {
    if (origin === '') {
      throw configurationError(`entry ${index + 1} is empty`);
    }

    let url: URL;
    try {
      url = new URL(origin);
    } catch {
      throw configurationError(`entry ${index + 1} is not a valid URL origin`);
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw configurationError(`entry ${index + 1} must use HTTP or HTTPS`);
    }

    if (
      url.username !== '' ||
      url.password !== '' ||
      url.pathname !== '/' ||
      url.search !== '' ||
      url.hash !== ''
    ) {
      throw configurationError(`entry ${index + 1} must be an exact origin`);
    }

    if (url.origin !== origin) {
      throw configurationError(
        `entry ${index + 1} is ambiguous or not canonical`,
      );
    }

    if (parsedOrigins.has(origin)) {
      throw configurationError(`entry ${index + 1} duplicates another origin`);
    }

    parsedOrigins.add(origin);
  });

  return [...parsedOrigins];
}

export function createCorsOptions(value: string | undefined): CorsOptions {
  const allowedOrigins = new Set(parseCorsOrigins(value));

  return {
    origin: (origin, callback) => {
      callback(null, origin === undefined || allowedOrigins.has(origin));
    },
    methods: CORS_METHODS,
    allowedHeaders: CORS_HEADERS,
    credentials: false,
  };
}
