import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('coupons')
class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  code: string;
  @Column('timestamp')
  expire_date: Date;
  @Column('int4')
  amount: number;
  @Column('bool')
  is_percent: boolean;
  @Column('bool')
  is_single_use: boolean;
  @Column('bool')
  is_active: boolean;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

export default Coupon;
