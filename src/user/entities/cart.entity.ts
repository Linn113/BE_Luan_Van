import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cardItem.entity';


@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column('json')
  detailCard: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items?: CartItem[];
}
