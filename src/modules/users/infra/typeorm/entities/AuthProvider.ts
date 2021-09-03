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
  PrimaryColumn,
  JoinColumn,
  ManyToOne
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

@Entity('auth_providers')
class AuthProviders {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @PrimaryColumn('text')
  @Length(1, 128)
  id: string;

  @Column('text') // 'classic' | 'google'
  type: string;

  @Column('text')
  user_id: string;

  @ManyToOne(type => User, user => user.auth_providers,{
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export default AuthProviders;
