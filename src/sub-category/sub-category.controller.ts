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
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@ApiTags('Sub Categories')
@ApiBearerAuth()
@Controller('sub-categories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  @UseGuards(JwtAdminGuard)
  @Message('Sub category created successfully')
  @ApiOperation({ summary: 'Create sub category' })
  @ApiBody({ type: CreateSubCategoryDto })
  @ApiCreatedResponse({ description: 'Sub category created successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, conflict: true })
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Message('Sub categories fetched successfully')
  @ApiOperation({ summary: 'List sub categories' })
  @ApiPaginationQueries('Search by sub-category name')
  @ApiOkResponse({ description: 'Sub categories fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.subCategoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Message('Sub category fetched successfully')
  @ApiOperation({ summary: 'Get sub category by id' })
  @ApiMongoIdParam('id', 'Sub category id')
  @ApiOkResponse({ description: 'Sub category fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id, undefined, undefined, {
      path: 'categoryId',
    });
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Sub category updated successfully')
  @ApiOperation({ summary: 'Update sub category' })
  @ApiMongoIdParam('id', 'Sub category id')
  @ApiBody({ type: UpdateSubCategoryDto })
  @ApiOkResponse({ description: 'Sub category updated successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Sub category deleted successfully')
  @ApiOperation({ summary: 'Soft delete sub category' })
  @ApiMongoIdParam('id', 'Sub category id')
  @ApiOkResponse({ description: 'Sub category deleted successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  remove(@Param('id') id: string) {
    return this.subCategoryService.softDelete(id);
  }
}
