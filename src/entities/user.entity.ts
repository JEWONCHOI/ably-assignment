import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Drawer } from './drawer.entity';
import { Zzim } from './zzim.entity';
import { ZzimItem } from './zzim-item.entity';

@Entity({ name: 'user' })
@Index('email_index', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'nickname',
  })
  nickname: string;

  @OneToMany(() => Drawer, (drawer) => drawer.user, {
    createForeignKeyConstraints: false,
  })
  drawers: Drawer[];

  @OneToMany(() => Zzim, (zzim) => zzim.user, {
    createForeignKeyConstraints: false,
  })
  zzims: Zzim[];

  @OneToMany(() => ZzimItem, (zzimItem) => zzimItem.user, {
    createForeignKeyConstraints: false,
  })
  zzimItems: ZzimItem[];
}
