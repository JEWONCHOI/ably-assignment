import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Zzim } from './zzim.entity';
import { ZzimItem } from './zzim-item.entity';

@Entity({ name: 'drawer' })
export class Drawer {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  thumbnails: string[];

  @Column({
    type: 'int',
    default: 0,
  })
  zzim_count: number;

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

  @OneToMany(() => Zzim, (zzim) => zzim.drawer, {
    createForeignKeyConstraints: false,
  })
  zzims: Zzim[];

  @OneToMany(() => ZzimItem, (zzimItem) => zzimItem.drawer, {
    createForeignKeyConstraints: false,
  })
  zzimItems: Zzim[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
