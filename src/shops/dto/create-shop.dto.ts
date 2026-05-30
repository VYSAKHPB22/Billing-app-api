import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({ example: 'Fresh Mart' })
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty({ example: 'owner@freshmart.com' })
  @IsEmail()
  shopEmail: string;

  @ApiProperty({ example: '9999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
