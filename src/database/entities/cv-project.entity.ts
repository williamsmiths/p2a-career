import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cv } from './cv.entity';

/**
 * Entity CV Project - Bảng cv_projects chứa dự án đã tham gia
 */
@Entity('cv_projects')
export class CvProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cv_id', type: 'uuid' })
  cvId: string;

  @Column({ name: 'project_name', length: 255 })
  projectName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'project_url', type: 'text', nullable: true })
  projectUrl: string | null;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  // Relations
  @ManyToOne(() => Cv, (cv) => cv.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_id' })
  cv: Cv;
}

