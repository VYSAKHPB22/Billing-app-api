import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessAdminsController } from './business-admins.controller';
import { BusinessAdminsService } from './business-admins.service';
import {
  BusinessAdmin,
  BusinessAdminSchema,
} from './schemas/business-admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessAdmin.name, schema: BusinessAdminSchema },
    ]),
  ],
  controllers: [BusinessAdminsController],
  providers: [BusinessAdminsService],
  exports: [BusinessAdminsService, MongooseModule],
})
export class BusinessAdminsModule {}
