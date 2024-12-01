import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { AddItemToCardDto } from './dto/addItemToCard.dto';
import { products } from 'src/database/data/seeding-data';
import { Product } from 'src/product/entities/product.entity';
import { User } from './entities/user.entity';
import { NotFoundError } from 'rxjs';
import { RemoveItemToCardDto } from './dto/removeItemFromCart';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getCard(userId: string) {
    try {
      const cardExit = await this.cartRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

      if (cardExit.detailCard) {
        const listProduct = JSON.parse(cardExit.detailCard);
        const newDetail = await Promise.all(
          listProduct.map(async (product: any) => {
            const productDetail = await this.productRepo.findOne({
              where: { id: product.id },
              relations: { discount: true },
            });
            return {
              ...product,
              discount: productDetail?.discount || null,
            };
          }),
        );

        cardExit.detailCard = JSON.stringify(newDetail);
      }

      return cardExit;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addItemToCard(userId: string, addItemToCardDto: AddItemToCardDto) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

      const cardExit = await this.cartRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

      if (!cardExit) {
        let detailCard: any;

        const product = await this.productRepo.findOne({
          where: {
            id: addItemToCardDto.id,
          },
        });

        detailCard = [
          {
            id: `${product.id}`,
            images: product.images,
            name: product.name,
            quantity: addItemToCardDto.quantity,
            price: product.price,
          },
        ];

        const newCard = await this.cartRepo.save({
          user: user,
          detailCard: JSON.stringify(detailCard),
        });

        return newCard;
      } else {
        let detailCard;
        try {
          detailCard = JSON.parse(cardExit.detailCard);
        } catch (error) {
          detailCard = [];
        }

        const productIndex = detailCard.findIndex(
          (item) => item.id === addItemToCardDto.id,
        );
        if (productIndex !== -1) {
          detailCard[productIndex].quantity += addItemToCardDto.quantity;
        } else {
          const product = await this.productRepo.findOne({
            where: {
              id: addItemToCardDto.id,
            },
          });

          detailCard.push({
            id: `${addItemToCardDto.id}`,
            images: product.images,
            name: product.name,
            quantity: addItemToCardDto.quantity,
            price: product.price,
          });
        }
        cardExit.detailCard = JSON.stringify(detailCard);

        await this.cartRepo.save(cardExit);

        return cardExit;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async minusItemToCard(userId: string, addItemToCardDto: RemoveItemToCardDto) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

      const cardExit = await this.cartRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

      let detailCard;
      try {
        detailCard = JSON.parse(cardExit.detailCard);
      } catch (error) {
        detailCard = [];
      }

      const productIndex = detailCard.findIndex(
        (item) => item.id === addItemToCardDto.id,
      );
      if (productIndex !== -1) {
        detailCard[productIndex].quantity =
          detailCard[productIndex].quantity - addItemToCardDto.quantity;
        if (detailCard[productIndex].quantity <= 0) {
          detailCard.splice(productIndex, 1);
        }
      } else {
        const product = await this.productRepo.findOne({
          where: {
            id: addItemToCardDto.id,
          },
        });

        detailCard.push({
          id: `${addItemToCardDto.id}`,
          images: product.images,
          name: product.name,
          quantity: addItemToCardDto.quantity,
          price: product.price,
        });
      }
      cardExit.detailCard = JSON.stringify(detailCard);

      await this.cartRepo.save(cardExit);

      return cardExit;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async removeItemToCard(
    userId: string,
    addItemToCardDto: RemoveItemToCardDto,
  ) {
    try {
      const cardExit = await this.cartRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

      if (!cardExit) {
        throw new BadRequestException('Cart not found');
      } else {
        let detailCard;
        try {
          detailCard = JSON.parse(cardExit.detailCard);
        } catch (error) {
          detailCard = [];
        }

        const productIndex = detailCard.findIndex(
          (item) => item.id === addItemToCardDto.id,
        );
        if (productIndex !== -1) {
          detailCard.splice(productIndex, 1);
        } else {
          throw new BadRequestException('Product not found in cart');
        }
        cardExit.detailCard = JSON.stringify(detailCard);

        await this.cartRepo.save(cardExit);

        return cardExit;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateItemToCart() {}
}
