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

// import { Exclude, Expose } from 'class-transformer';

import AuthProvider from './AuthProvider';
import UserClassicInfo from './UserClassicInfo';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  @Length(1, 255)
  name: string;

  @Column('text', { default: 'basic' }) // basic, admin, ghost
  role: string;

  @Column('text')
  @IsEmail()
  email: string;

  @OneToOne(type => UserClassicInfo, userClassicInfo => userClassicInfo.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  classic_info: UserClassicInfo;

  @OneToMany(() => AuthProvider, authProvider => authProvider.user)
  auth_providers: AuthProvider[];

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
