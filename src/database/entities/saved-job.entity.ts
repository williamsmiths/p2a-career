import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';

/**
 * Entity Saved Job - Bảng saved_jobs chứa công việc đã lưu
 */
@Entity('saved_jobs')
export class SavedJob {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'job_id', type: 'uuid' })
  jobId: string;

  @CreateDateColumn({
    name: 'saved_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  savedAt: Date;

  // Relations
  @ManyToOne(() => Job, (job) => job.savedJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: Job;
}

