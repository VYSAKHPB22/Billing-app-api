import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './schemas/sub-category.schema';

@Injectable()
export class SubCategoryService extends BaseCrudService<SubCategory> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
  ) {
    super(subCategoryModel, 'Sub category');
  }

  findAll(query: PaginationQueryDto) {
    const filter: Record<string, any> = query.search
      ? { name: { $regex: query.search, $options: 'i' } }
      : {};

    return super.findAll(query, filter, { path: 'categoryId' });
  }

  create(dto: CreateSubCategoryDto) {
    return super.create({
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
    });
  }

  update(id: string, dto: UpdateSubCategoryDto) {
    return super.update(id, {
      ...dto,
      categoryId: dto.categoryId
        ? new Types.ObjectId(dto.categoryId)
        : undefined,
    });
  }
}
