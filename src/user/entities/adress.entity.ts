import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  nameAddress: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
