import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cv } from './cv.entity';

/**
 * Entity CV Experience - Bảng cv_experience chứa kinh nghiệm làm việc
 */
@Entity('cv_experience')
export class CvExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cv_id', type: 'uuid' })
  cvId: string;

  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @Column({ length: 255 })
  position: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text' })
  description: string;

  // Relations
  @ManyToOne(() => Cv, (cv) => cv.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_id' })
  cv: Cv;
}

