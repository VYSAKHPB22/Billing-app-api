import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryService extends BaseCrudService<Category> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel, 'Category');
  }

  findAll(query: PaginationQueryDto) {
    const filter = query.search
      ? { name: { $regex: query.search, $options: 'i' } }
      : {};

    return super.findAll(query, filter);
  }
}
