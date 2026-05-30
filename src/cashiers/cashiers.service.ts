import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { getPaginationOptions } from '../common/utils/pagination.util';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { Cashier, CashierDocument } from './schemas/cashier.schema';

@Injectable()
export class CashiersService {
  constructor(
    @InjectModel(Cashier.name)
    private readonly cashierModel: Model<CashierDocument>,
  ) {}

  async create(dto: CreateCashierDto): Promise<CashierDocument> {
    const existingCashier = await this.findByUsername(dto.username);

    if (existingCashier) {
      throw new BadRequestException('Username already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);

    return this.cashierModel.create({
      ...dto,
      shopId: new Types.ObjectId(dto.shopId),
      password,
      role: UserRole.CASHIER,
      isActive: dto.isActive ?? true,
    });
  }

  async findByUsername(username: string) {
    return this.cashierModel.findOne({ username, deletedAt: null }).exec();
  }

  async findById(id: string) {
    return this.cashierModel.findOne({ _id: id, deletedAt: null }).exec();
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
      this.cashierModel
        .find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.cashierModel.countDocuments(filter).exec(),
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
    const cashier = await this.cashierModel
      .findOne({ _id: id, shopId: new Types.ObjectId(shopId), deletedAt: null })
      .select('-password')
      .exec();

    if (!cashier) {
      throw new NotFoundException('Cashier not found');
    }

    return cashier;
  }
}
