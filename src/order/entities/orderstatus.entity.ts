import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  status: string;

  @OneToMany(() =>Order,(order)=> order.status)
  order:Order[]
}
