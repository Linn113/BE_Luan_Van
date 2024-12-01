import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { IOffsetPaginatedType } from 'src/common/IoffsetPanigation';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount) private discountRepo: Repository<Discount>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const discount = this.discountRepo.create(createDiscountDto);
      if (!discount) {
        throw new BadRequestException('Discount create fail');
      }

      await this.discountRepo.save(discount);
      return discount;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Discount>> {
    const { limit, page, search, category, sortOrder, sortOrderBy } =
      queryPagination;

    const queryBuilder = this.discountRepo.createQueryBuilder('o');

    if (search) {
      const searchTerm = search.toLowerCase();
      queryBuilder.andWhere(
        'LOWER(o.description::text) LIKE :search', // Use new alias 'o'
        { search: `%${searchTerm}%` },
      );
    }

    if (sortOrder) {
      queryBuilder.orderBy(`o.${sortOrderBy || 'dateStart'}`, sortOrder);
    }

    queryBuilder.skip(limit * (page - 1)).take(limit);

    const [products, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      pageNumber: page,
      totalCount: itemCount,
      pageSize: limit,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    try {
      const products = await this.productRepo.findByIds(
        updateDiscountDto.products,
      );

      const discount = await this.discountRepo.findOneById(id);

      if (!products) {
        throw new BadRequestException('Product not found');
      }

      if (!discount) {
        throw new BadRequestException('Discount not found');
      }

      for (let product of products) {
        product.discount = discount;
      }

      const newProducts = await this.productRepo.save(products);
      return newProducts;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateInfo(id: string, updateDiscountDto: CreateDiscountDto) {
    try {
      const discount = await this.discountRepo.findOneById(id);

      if (!discount) {
        throw new BadRequestException('Discount not found');
      }

      const discountUpdated = await this.discountRepo.save({
        ...discount,
        ...updateDiscountDto,
      });

      return discountUpdated;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      // Fetch the discount with related products
      const discount = await this.discountRepo.findOne({
        where: { id: id },
        relations: { products: true },
      });

      // Check if the discount exists
      if (!discount) {
        throw new BadRequestException('Discount not found');
      }

      // If there are related products, nullify the discount relation
      if (discount.products && discount.products.length > 0) {
        const productsToUpdate = discount.products.map((product) => ({
          ...product,
          discount: null, // Remove the relation to the discount
        }));

        // Update the products to remove the discount reference
        await this.productRepo.save(productsToUpdate);
      }

      // Now delete the discount
      const discountDeleted = await this.discountRepo.delete(id); // Pass id directly

      return discountDeleted;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
