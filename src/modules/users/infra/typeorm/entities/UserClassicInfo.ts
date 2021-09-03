import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  AfterLoad,
  JoinColumn,
  ManyToOne,
  OneToOne
} from 'typeorm';

import {
  IsEmail,
  Min,
  Max,
  MaxLength,
  MinLength,
  Length
} from 'class-validator';

import { Exclude, Expose } from 'class-transformer';
import User from './User';

@Entity('users_classic_info')
class UserClassicInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  user_id: string;

  @OneToOne(type => User, user => user.classic_info,{
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  @Exclude()
  password: string;

  @Column('bool', { default: false })
  is_verified: boolean;
}

export default UserClassicInfo;
