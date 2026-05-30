import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterShopDto {
  @ApiProperty({ example: 'Fresh Mart' })
  @IsString()
  @IsNotEmpty()
  shopName!: string;

  @ApiProperty({ example: 'owner@freshmart.com' })
  @IsEmail()
  shopEmail!: string;


  @ApiProperty({ example: '9999999999' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'freshmart_admin' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterCashierDto {
  @ApiProperty({ example: 'Cashier One' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsMongoId()
  shopId!: string;

  @ApiProperty({ example: '8888888888' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'cashier_01' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'freshmart_admin' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
