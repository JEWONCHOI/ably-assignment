import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Drawer } from './drawer.entity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity({ name: 'zzim' })
export class Zzim {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Drawer, (drawer) => drawer.zzims, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'drawer_id',
  })
  drawer: Drawer;

  @Index()
  @Column({
    type: 'int',
  })
  drawer_id: number;

  @ManyToOne(() => User, (user) => user.zzims, {
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

  @ManyToOne(() => Product, (product) => product.zzims, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'product_id',
  })
  product: Product;

  @Index()
  @Column({
    type: 'int',
  })
  product_id: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
