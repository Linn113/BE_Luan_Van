import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { New } from './new.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  headTitle: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => New, (targe) => targe.contents)
  new?: New;
}
