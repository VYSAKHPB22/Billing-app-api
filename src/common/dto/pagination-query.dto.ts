import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationDefaults } from '../enums/pagination.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    default: PaginationDefaults.PAGE,
    minimum: PaginationDefaults.PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PaginationDefaults.PAGE)
  @IsOptional()
  page = PaginationDefaults.PAGE;

  @ApiPropertyOptional({
    default: PaginationDefaults.LIMIT,
    minimum: PaginationDefaults.PAGE,
    maximum: PaginationDefaults.MAX_LIMIT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PaginationDefaults.PAGE)
  @Max(PaginationDefaults.MAX_LIMIT)
  @IsOptional()
  limit = PaginationDefaults.LIMIT;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
