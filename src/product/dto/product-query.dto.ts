import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  subCategoryId?: string;
}
