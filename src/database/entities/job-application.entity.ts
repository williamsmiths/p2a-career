import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApplicationStatus } from '../../common/enums';
import { Job } from './job.entity';
import { Cv } from './cv.entity';

/**
 * Entity Job Application - Bảng job_applications chứa hồ sơ ứng tuyển
 */
@Entity('job_applications')
@Index(['jobId', 'userId'], { unique: true })
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_id', type: 'uuid' })
  jobId: string;

  @Column({ name: 'cv_id', type: 'uuid' })
  cvId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.SUBMITTED,
  })
  status: ApplicationStatus;

  @Column({ name: 'recruiter_notes', type: 'text', nullable: true })
  recruiterNotes: string | null;

  @CreateDateColumn({
    name: 'applied_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  appliedAt: Date;

  // Relations
  @ManyToOne(() => Job, (job) => job.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Cv, (cv) => cv.applications)
  @JoinColumn({ name: 'cv_id' })
  cv: Cv;
}

