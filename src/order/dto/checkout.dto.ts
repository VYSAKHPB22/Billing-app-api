import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '../../common/enums/payment-method.enum';

export class CheckoutDto {
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 20, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;
}
