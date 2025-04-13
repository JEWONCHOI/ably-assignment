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
import { User } from './user.entity';
import { Product } from './product.entity';

@Index('user_zzim_product', ['user_id', 'product_id'])
@Entity({ name: 'zzim_item' })
export class ZzimItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'int',
    name: 'price',
  })
  price: number;

  @Column({
    type: 'varchar',
    name: 'thumbnail',
  })
  thumbnail: string;

  @ManyToOne(() => User, (user) => user.zzimItems, {
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

  @ManyToOne(() => Product, (product) => product.zzimItems, {
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
    name: 'product_id',
  })
  product_id: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
