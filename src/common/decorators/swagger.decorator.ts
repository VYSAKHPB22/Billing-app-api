import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginationDefaults } from '../enums/pagination.enum';

interface StandardErrorOptions {
  auth?: boolean;
  conflict?: boolean;
  forbidden?: boolean;
  notFound?: boolean;
}

export function ApiStandardErrors(options: StandardErrorOptions = {}) {
  const decorators = [
    ApiBadRequestResponse({
      description: 'Invalid request data or validation failed',
    }),
    ApiInternalServerErrorResponse({
      description: 'Unexpected server error',
    }),
  ];

  if (options.auth) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired access token',
      }),
    );
  }

  if (options.forbidden) {
    decorators.push(
      ApiForbiddenResponse({
        description: 'User does not have permission for this action',
      }),
    );
  }

  if (options.notFound) {
    decorators.push(
      ApiNotFoundResponse({
        description: 'Requested resource was not found',
      }),
    );
  }

  if (options.conflict) {
    decorators.push(
      ApiConflictResponse({
        description: 'Duplicate or conflicting resource',
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ApiPaginationQueries(searchDescription = 'Search keyword') {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: PaginationDefaults.PAGE,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: PaginationDefaults.LIMIT,
      description: 'Records per page',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: searchDescription,
    }),
  );
}

export function ApiMongoIdParam(name = 'id', description = 'MongoDB document id') {
  return ApiParam({
    name,
    example: '6659f4b6f4a8d7557d9f0001',
    description,
  });
}
