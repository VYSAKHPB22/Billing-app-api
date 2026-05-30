import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginationDefaults } from '../enums/pagination.enum';

export function getPaginationOptions(query: PaginationQueryDto) {
  const page = Number(query.page || PaginationDefaults.PAGE);
  const limit = Number(query.limit || PaginationDefaults.LIMIT);
  const skip = (page - PaginationDefaults.PAGE) * limit;

  return { page, limit, skip };
}
