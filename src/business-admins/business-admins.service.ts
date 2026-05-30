import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { getPaginationOptions } from '../common/utils/pagination.util';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import {
  BusinessAdmin,
  BusinessAdminDocument,
} from './schemas/business-admin.schema';

@Injectable()
export class BusinessAdminsService {
  constructor(
    @InjectModel(BusinessAdmin.name)
    private readonly businessAdminModel: Model<BusinessAdminDocument>,
  ) {}

  async create(dto: CreateBusinessAdminDto): Promise<BusinessAdminDocument> {
    const existingAdmin = await this.findByUsername(dto.username);

    if (existingAdmin) {
      throw new BadRequestException('Username already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);

    return this.businessAdminModel.create({
      ...dto,
      shopId: new Types.ObjectId(dto.shopId),
      password,
      role: UserRole.ADMIN,
      isActive: dto.isActive ?? true,
    });
  }

  async findByUsername(username: string) {
    return this.businessAdminModel
      .findOne({ username, deletedAt: null })
      .exec();
  }

  async findById(id: string) {
    return this.businessAdminModel.findOne({ _id: id, deletedAt: null }).exec();
  }

  async findAllByShop(query: PaginationQueryDto, shopId: string) {
    const { page, limit, skip } = getPaginationOptions(query);
    const filter = {
      shopId: new Types.ObjectId(shopId),
      deletedAt: null,
      ...(query.search
        ? { name: { $regex: query.search, $options: 'i' } }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.businessAdminModel
        .find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.businessAdminModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneByShop(id: string, shopId: string) {
    const admin = await this.businessAdminModel
      .findOne({ _id: id, shopId: new Types.ObjectId(shopId), deletedAt: null })
      .select('-password')
      .exec();

    if (!admin) {
      throw new NotFoundException('Business admin not found');
    }

    return admin;
  }
}
