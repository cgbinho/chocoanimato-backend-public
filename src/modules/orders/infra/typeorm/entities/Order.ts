import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  user_id: string;

  @ManyToOne(type => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  reference_id: string;
  @Column('text', { nullable: true })
  transaction_id: string; // PAYMENT PROCESSOR TRANSACTION ID
  @Column('text')
  payment_method: string;

  @Column('simple-json', { default: null })
  boleto: {};
  // @Column({ nullable: true })
  // payment_link: string;

  @Column('simple-array')
  project_ids: string[];

  @Column('int4')
  gross_amount: number;
  @Column('int4')
  discount_amount: number;
  @Column('int4')
  net_amount: number;
  @Column('int4')
  installment_count: number;
  @Column('text')
  status: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
