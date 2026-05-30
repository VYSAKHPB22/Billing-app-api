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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Message } from '../common/decorators/message.decorator';
import {
  ApiMongoIdParam,
  ApiPaginationQueries,
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAdminGuard)
  @Message('Product created successfully')
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, conflict: true })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Message('Products fetched successfully')
  @ApiOperation({
    summary: 'List products',
    description:
      'Returns paginated products with optional search, category, and sub-category filters.',
  })
  @ApiPaginationQueries('Search by product name')
  @ApiQuery({ name: 'categoryId', required: false, description: 'Category id' })
  @ApiQuery({
    name: 'subCategoryId',
    required: false,
    description: 'Sub category id',
  })
  @ApiOkResponse({ description: 'Products fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Message('Product fetched successfully')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiMongoIdParam('id', 'Product id')
  @ApiOkResponse({ description: 'Product fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Product updated successfully')
  @ApiOperation({ summary: 'Update product' })
  @ApiMongoIdParam('id', 'Product id')
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  @Message('Product deleted successfully')
  @ApiOperation({ summary: 'Soft delete product' })
  @ApiMongoIdParam('id', 'Product id')
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true, notFound: true })
  remove(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }
}
