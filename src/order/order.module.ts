import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/product/entities/category.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/orderstatus.entity';
import { Payment } from './entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/user/entities/cart.entity';
import { Address } from 'src/user/entities/adress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      User,
      Product,
      Category,
      Order,
      OrderStatus,
      Address,
      Payment,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
