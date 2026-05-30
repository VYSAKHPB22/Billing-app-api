import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BusinessAdminsModule } from './business-admins/business-admins.module';
import { CartModule } from './cart/cart.module';
import { CashiersModule } from './cashiers/cashiers.module';
import { CategoryModule } from './category/category.module';
import { HttpExceptionFilter } from './common/filter/global.exception.filter';
import { ActivityLogInterceptor } from './common/interceptors/activity-log.interceptor';
import { ResponseInterceptor } from './common/interceptors/global.response.interceptors';
import { LogsModule } from './logs/logs.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ShopsModule } from './shops/shops.module';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongouri'
      }),
    }),
    AuthModule,
    ShopsModule,
    BusinessAdminsModule,
    CashiersModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
