import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { OrderStatus } from './orderstatus.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetail)
  orderId: Order;

  @OneToOne(() => Product)
  @JoinColumn()
  profile: Product;

  @Column()
  quantity: number;
}
