import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { OffsetPaginationDto } from 'src/common/offsetPagination';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() queryPagination: OffsetPaginationDto) {
    return this.categoryService.findAll(queryPagination);
  }

  @Get('/all')
  findAllWithoutPag() {
    return this.categoryService.findAllWithOutPag();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: CreateCategoryDto) {
    return this.categoryService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
