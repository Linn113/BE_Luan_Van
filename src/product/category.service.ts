import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IOffsetPaginatedType } from 'src/common/IoffsetPanigation';
import { OffsetPaginationDto } from 'src/common/offsetPagination';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryRepo.save(createCategoryDto);
      return category;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Thêm sản phẩm lỗi');
    }
  }

  async findAll(
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Category>> {
    try {
      const { limit, page, search, category, sortOrder, sortOrderBy } =
        queryPagination;

      const queryBuilder = this.categoryRepo.createQueryBuilder('category');

      // Search filter
      if (search) {
        const searchTerm = search.toLowerCase().replace(/\s/g, '');
        queryBuilder.andWhere(
          "(LOWER(REPLACE(category.name, ' ', '')) LIKE :search)",
          { search: `%${searchTerm}%` },
        );
      }

      // Pagination
      queryBuilder.skip(Number(limit) * (Number(page) - 1)).take(Number(limit));

      // Get data
      const [products, itemCount] = await queryBuilder.getManyAndCount();

      return {
        data: products,
        pageNumber: page,
        totalCount: itemCount,
        pageSize: limit,
      };
    } catch (error) {
      throw new BadRequestException('tìm danh mục lỗi');
    }
  }

  async findAllWithOutPag() {
    try {
      const categories = await this.categoryRepo.find();

      return categories;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Thêm sản phẩm lỗi');
    }
  }

  async update(id: string, updateProductDto: CreateCategoryDto) {
    try {
      const category = await this.categoryRepo.findOneById(id);
      if (!category) {
        throw new BadRequestException('KHông tìm được danh mục');
      }

      category.name = updateProductDto.name;
      category.description = updateProductDto.description;

      await this.categoryRepo.save(category);

      return category;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Thêm sản phẩm lỗi');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepo.findOneById(id);
      if (!category) {
        throw new BadRequestException('KHông tìm được danh mục');
      }

      const categoryDeleted = await this.categoryRepo.delete(category);

      return categoryDeleted;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Thêm sản phẩm lỗi');
    }
  }
}
