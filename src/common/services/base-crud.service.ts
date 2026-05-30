import { NotFoundException } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { getPaginationOptions } from '../utils/pagination.util';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseCrudService<T> {
  protected constructor(
    protected readonly model: Model<T>,
    protected readonly entityName: string,
  ) {}

  async create(createDto: any): Promise<T> {
    return this.model.create(createDto);
  }

  async findAll(
    query: PaginationQueryDto,
    filter: Record<string, any> = {},
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<PaginatedResult<T>> {
    const { page, limit, skip } = getPaginationOptions(query);
    const baseFilter = { ...filter, deletedAt: null };

    const [data, total] = await Promise.all([
      this.model
        .find(baseFilter)
        .populate(populate || [])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(baseFilter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(
    id: string,
    projection?: any,
    options?: any,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T> {
    const item = await this.model
      .findOne({ _id: id, deletedAt: null }, projection, options)
      .populate(populate || [])
      .exec();

    if (!item) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return item;
  }

  async update(id: string, updateDto: any): Promise<T> {
    const item = await this.model
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        updateDto,
        { new: true },
      )
      .exec();

    if (!item) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return item;
  }

  async softDelete(id: string): Promise<{ deleted: true }> {
    const item = await this.model
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!item) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return { deleted: true };
  }
}
