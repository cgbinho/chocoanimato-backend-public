import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import VideoInfo from '@modules/projects/infra/typeorm/entities/VideoInfo';

@Entity('templates', {
  orderBy: {
    updated_at: 'ASC'
  }
})
class Template extends VideoInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  description: string;
  @Column('simple-array')
  category: string[];
  @Column('int4')
  duration: number;
  @Column('text')
  ratio: string;
  @Column('int4')
  price: number;
}

export default Template;
