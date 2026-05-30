import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Hot' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsMongoId()
  categoryId: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
