import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BusinessAdminsModule } from '../business-admins/business-admins.module';
import { CashiersModule } from '../cashiers/cashiers.module';
import { ShopsModule } from '../shops/shops.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    BusinessAdminsModule,
    CashiersModule,
    ShopsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'billing-access-secret',
      signOptions: {
        expiresIn: (process.env.JWT_ACCESS_EXPIRY || '1d') as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
