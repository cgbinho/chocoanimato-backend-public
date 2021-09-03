import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

// import { Exclude } from 'class-transformer';
import { Exclude } from 'class-transformer';

abstract class VideoInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  @Exclude()
  path: string;
  @Column('text')
  @Exclude()
  status: string; // Projects: 'editing' | 'ordered' | 'delivered' |  Templates: 'active' | 'inactive';
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

export default VideoInfo;
