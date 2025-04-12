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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
