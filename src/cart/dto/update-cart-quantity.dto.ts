import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, Min } from 'class-validator';

export class UpdateCartQuantityDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
