import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'drawer' })
export class Drawer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  images: string[];

  @ManyToOne(() => User, (user) => user.drawers, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'user_id',
  })
  user: User;

  @Index()
  @Column({
    type: 'int',
  })
  user_id: number;
}
