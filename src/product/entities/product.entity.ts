import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Discount } from 'src/discount/entities/discount.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({
    nullable: true,
  })
  status: string;

  @Column()
  calories: number;

  @Column({ nullable: true, default: 0 })
  numberSeller: number;

  @Column('json', { nullable: true })
  rating: any;

  @Column('json')
  images: string;

  @Column({
    nullable: true,
  })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category?: Category;

  @ManyToOne(() => Discount, (discount) => discount.products, {
    nullable: true,
  })
  discount?: Discount;
}
