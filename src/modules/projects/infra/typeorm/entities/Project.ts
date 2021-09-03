import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import Template from '@modules/templates/infra/typeorm/entities/Template';
import VideoInfo from '@modules/projects/infra/typeorm/entities/VideoInfo';

import IFieldsDTO from '@modules/projects/dtos/IFieldsDTO';

@Entity('projects', {
  orderBy: {
    updated_at: 'DESC'
  }
})
class Project extends VideoInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ nullable: false })
  // name: string;

  @Column('text')
  user_id: string;

  @ManyToOne(type => User,{
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  template_id: string;

  @ManyToOne(type => Template, {
    eager: true
  })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column('simple-json')
  sections: Object[];
  @Column('simple-json')
  fields: IFieldsDTO[];
}

export default Project;
