import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Zzim } from './zzim.entity';
import { ZzimItem } from './zzim-item.entity';

@Entity({ name: 'product' })
export class Product {
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

  @OneToMany(() => Zzim, (zzim) => zzim.product, {
    createForeignKeyConstraints: false,
  })
  zzims: Zzim[];

  @OneToMany(() => ZzimItem, (zzimItem) => zzimItem.product, {
    createForeignKeyConstraints: false,
  })
  zzimItems: ZzimItem[];
}
