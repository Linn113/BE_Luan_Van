import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  percent: number;

  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;

  @OneToMany(() => Product, (product) => product.discount) // Add one-to-many relationship
  products: Product[];
}
