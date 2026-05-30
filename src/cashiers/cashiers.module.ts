import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashiersController } from './cashiers.controller';
import { CashiersService } from './cashiers.service';
import { Cashier, CashierSchema } from './schemas/cashier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cashier.name, schema: CashierSchema }]),
  ],
  controllers: [CashiersController],
  providers: [CashiersService],
  exports: [CashiersService, MongooseModule],
})
export class CashiersModule {}
