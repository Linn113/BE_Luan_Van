import { Category } from 'src/product/entities/category.entity';
import { DataSource } from 'typeorm';
import {
  categories,
  orders,
  payments,
  products,
  userAdmin,
} from './data/seeding-data';
import { Product } from 'src/product/entities/product.entity';
import { Payment } from 'src/order/entities/payment.entity';
import { OrderStatus } from 'src/order/entities/orderstatus.entity';
import { User } from 'src/user/entities/user.entity';

export async function seedData(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const payment = dataSource.getRepository(Payment);
  const orderStatus = dataSource.getRepository(OrderStatus);
  const user = dataSource.getRepository(User);

  await categoryRepo.save(categories);
  await payment.save(payments);
  await orderStatus.save(orders);
  await user.save(userAdmin);

  for (const product of products) {
    const category = await categoryRepo.findOne({
      where: { id: product.category },
    });

    await productRepo.save({
      ...product,
      category: category,
    });
  }
}
