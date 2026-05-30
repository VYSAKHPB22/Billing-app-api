import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Message } from '../common/decorators/message.decorator';
import {
  ApiMongoIdParam,
  ApiPaginationQueries,
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAdminGuard)
  @Message('Category created successfully')
  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ description: 'Category created successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, conflict: true })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Message('Categories fetched successfully')
  @ApiOperation({ summary: 'List categories' })
  @ApiPaginationQueries('Search by category name')
  @ApiOkResponse({ description: 'Categories fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Message('Category fetched successfully')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiMongoIdParam('id', 'Category id')
  @ApiOkResponse({ description: 'Category fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Category updated successfully')
  @ApiOperation({ summary: 'Update category' })
  @ApiMongoIdParam('id', 'Category id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ description: 'Category updated successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Category deleted successfully')
  @ApiOperation({ summary: 'Soft delete category' })
  @ApiMongoIdParam('id', 'Category id')
  @ApiOkResponse({ description: 'Category deleted successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  remove(@Param('id') id: string) {
    return this.categoryService.softDelete(id);
  }
  //categories can create by both admin and cashier, but only admin can update and delete categories. Cashiers can only view categories.
}
