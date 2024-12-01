import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { OrderStatus } from './orderstatus.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetail } from './orderdetail.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  totalPrice: number;

  @Column()
  timeShipping: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  isClient: boolean;

  @Column({ type: 'json' })
  address: string;

  @Column({ type: 'json', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  orderDetailJson?: string;

  @ManyToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @ManyToOne(() => OrderStatus, (payment) => payment.order)
  status: OrderStatus;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.orderId)
  orderDetail: OrderDetail[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
