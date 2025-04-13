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

@Index('user_zzim_product', ['user_id', 'product_id'])
@Entity({ name: 'zzim_item' })
export class ZzimItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    name: 'product_id',
  })
  product_id: number;

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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
