import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop, ShopDocument } from './schemas/shop.schema';

@Injectable()
export class ShopsService extends BaseCrudService<ShopDocument> {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<ShopDocument>,
  ) {
    super(shopModel, 'Shop');
  }

  async create(createShopDto: CreateShopDto): Promise<ShopDocument> {
    const existingShop = await this.shopModel
      .findOne({ shopEmail: createShopDto.shopEmail, deletedAt: null })
      .exec();

    if (existingShop) {
      throw new BadRequestException('Shop email already exists');
    }

    return this.shopModel.create(createShopDto);
  }

  async findAll(query: PaginationQueryDto) {
    const filter = query.search
      ? { shopName: { $regex: query.search, $options: 'i' } }
      : {};

    return super.findAll(query, filter);
  }
}
