import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseCrudService } from '../common/services/base-crud.service';
import { SubCategory } from '../sub-category/schemas/sub-category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService extends BaseCrudService<Product> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
  ) {
    super(productModel, 'Product');
  }

  async findAll(query: ProductQueryDto) {
    const filter: Record<string, any> = {};

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    if (query.subCategoryId) {
      filter.subCategoryId = new Types.ObjectId(query.subCategoryId);
    }

    if (query.categoryId) {
      const subCategories = await this.subCategoryModel
        .find({
          categoryId: new Types.ObjectId(query.categoryId),
          deletedAt: null,
        })
        .select('_id')
        .exec();

      filter.subCategoryId = { $in: subCategories.map((item) => item._id) };
    }

    return super.findAll(query, filter, {
      path: 'subCategoryId',
      populate: { path: 'categoryId' },
    });
  }

  create(dto: CreateProductDto) {
    return super.create({
      ...dto,
      subCategoryId: new Types.ObjectId(dto.subCategoryId),
    });
  }

  findOne(id: string) {
    return super.findOne(id, undefined, undefined, {
      path: 'subCategoryId',
      populate: { path: 'categoryId' },
    });
  }

  update(id: string, dto: UpdateProductDto) {
    return super.update(id, {
      ...dto,
      subCategoryId: dto.subCategoryId
        ? new Types.ObjectId(dto.subCategoryId)
        : undefined,
    });
  }
}
