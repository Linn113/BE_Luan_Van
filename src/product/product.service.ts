import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { IOffsetPaginatedType } from 'src/common/IoffsetPanigation';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { RatingDto } from './dto/rating.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.categoryRepo.findOne({
        where: {
          name: createProductDto.category,
        },
      });

      if (!category) {
        throw new BadRequestException('không tồn tại category');
      }

      const product = this.productRepo.create({
        ...createProductDto,
        category: category,
      });

      await this.productRepo.save(product);

      return product;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Thêm sản phẩm lỗi');
    }
  }

  async createMenu(createProductDto: CreateProductDto) {
    try {
      const category = await this.categoryRepo.findOne({
        where: {
          name: createProductDto.category,
        },
      });

      if (!category) {
        throw new BadRequestException('không tồn tại category');
      }

      if (!createProductDto.products) {
        throw new BadRequestException('không tồn tại products');
      }
      let productsBuoiSang = [];
      let productsBuoiChieu = [];

      if (createProductDto.products?.buoiSang) {
        productsBuoiSang = await this.productRepo.findByIds(
          createProductDto.products?.buoiSang,
        );
      }

      if (createProductDto.products?.buoiSang) {
        productsBuoiChieu = await this.productRepo.findByIds(
          createProductDto.products?.buoiChieu,
        );
      }

      const newDescription = {
        isMenu: true,
        description: createProductDto.description,
        listProductsSang: [],
        listProductsChieu: [],
      };

      for (const product of productsBuoiSang) {
        newDescription.listProductsSang.push(product.name);
      }

      for (const product of productsBuoiChieu) {
        newDescription.listProductsChieu.push(product.name);
      }

      const product = this.productRepo.create({
        ...createProductDto,
        description: JSON.stringify(newDescription),
        category: category,
      });

      await this.productRepo.save(product);

      return product;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Thêm sản phẩm lỗi');
    }
  }

  async findAll(
    productQueryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Product>> {
    const { limit, page, search, category, sortOrder, sortOrderBy } =
      productQueryPagination;

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.discount', 'discount'); // Join with Discount

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase().replace(/\s/g, '');
      queryBuilder.andWhere(
        "(LOWER(REPLACE(product.name, ' ', '')) LIKE :search)",
        { search: `%${searchTerm}%` },
      );
    }

    // Category filter
    if (category) {
      queryBuilder.andWhere('category.name = :category', {
        category,
      });
    }

    // Sorting
    if (sortOrder) {
      queryBuilder.orderBy(`product.${sortOrderBy || 'price'}`, sortOrder);
    }

    // Pagination
    queryBuilder.skip(limit * (page - 1)).take(limit);

    // Get data
    const [products, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      pageNumber: page,
      totalCount: itemCount,
      pageSize: limit,
    };
  }

  async findAllWithoutPag() {
    const products = await this.productRepo.find({
      take: 8,
    });
    return products;
  }

  async findAddWithoutPaginate() {
    try {
      const products = await this.productRepo.find();
      return products;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepo.findOne({
        where: {
          id: id,
        },
        relations: {
          category: true,
          discount: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async rating(productId: string, userId: string, updateProductDto: RatingDto) {
    try {
      const product = await this.productRepo.findOne({
        where: { id: productId },
      });

      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

      if (!product) {
        throw new NotFoundException('Sản phẩm không tìm thấy');
      }
      if (!user) {
        throw new NotFoundException('người dùng không tìm thấy');
      }

      // Initialize or parse the existing rating JSON
      let ratings = product.rating ? JSON.parse(product.rating) : [];

      ratings.push({
        userId,
        ...updateProductDto,
        name: `${user.firstName} ${user.lastName}`,
      });

      // Update the product's rating field
      product.rating = JSON.stringify(ratings);
      await this.productRepo.save(product);

      return { message: 'Đánh giá đã được cập nhật thành công' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    const category = await this.categoryRepo.findOne({
      where: {
        name: updateProductDto.category,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (!category) {
      throw new NotFoundException('Không tìm được danh mục');
    }

    product.category = category;
    product.name = updateProductDto.name;
    product.price = updateProductDto.price;
    product.status = updateProductDto.status;
    product.calories = updateProductDto.calories;
    product.description = updateProductDto.description;

    const updatedProduct = await this.productRepo.save(product);

    return updatedProduct;
  }

  async remove(id: string) {
    try {
      console.log(id);
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      return await this.productRepo.delete({ id });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete product');
    }
  }
}
