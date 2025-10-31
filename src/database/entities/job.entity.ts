import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { JobStatus, JobType } from '../../common/enums'
import { Company } from './company.entity'
import { JobApplication } from './job-application.entity'
import { SavedJob } from './saved-job.entity'

/**
 * Entity Job - Bảng jobs chứa thông tin tin tuyển dụng
 */
@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string

  @Column({ length: 255 })
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text' })
  requirements: string

  @Column({ type: 'text' })
  benefits: string

  @Column({ name: 'salary_min', type: 'int', nullable: true })
  salaryMin: number | null

  @Column({ name: 'salary_max', type: 'int', nullable: true })
  salaryMax: number | null

  @Column({
    name: 'job_type',
    type: 'enum',
    enum: JobType
  })
  jobType: JobType

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PENDING
  })
  status: JobStatus

  @Column({ type: 'timestamptz', nullable: true })
  deadline: Date | null

  @Column({ name: 'city_id', type: 'int', nullable: true })
  cityId: number | null

  @Column({ name: 'position_level_id', type: 'int', nullable: true })
  positionLevelId: number | null

  @Column({ name: 'experience_level_id', type: 'int', nullable: true })
  experienceLevelId: number | null

  @Column({ name: 'is_remote', type: 'boolean', default: false })
  isRemote: boolean

  @Column({ name: 'is_urgent', type: 'boolean', default: false })
  isUrgent: boolean

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number

  // Internship specific fields
  @Column({ name: 'duration_months', type: 'int', nullable: true })
  durationMonths: number | null

  @Column({ name: 'allowance_min', type: 'int', nullable: true })
  allowanceMin: number | null

  @Column({ name: 'allowance_max', type: 'int', nullable: true })
  allowanceMax: number | null

  @Column({ name: 'mentorship_available', type: 'boolean', default: false })
  mentorshipAvailable: boolean

  @Column({ name: 'learning_objectives', type: 'text', nullable: true })
  learningObjectives: string | null

  // Priority notification fields
  @Column({ name: 'notify_alumni', type: 'boolean', default: false })
  notifyAlumni: boolean

  @Column({ name: 'prioritize_university_id', type: 'uuid', nullable: true })
  prioritizeUniversityId: string | null

  // Additional filters
  @Column({ name: 'industry_id', type: 'int', nullable: true })
  industryId: number | null

  @Column({ name: 'country_id', type: 'int', nullable: true })
  countryId: number | null

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string | null

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date | null

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  // Relations
  @ManyToOne(() => Company, (company) => company.jobs, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'company_id' })
  company: Company

  @OneToMany(() => JobApplication, (application) => application.job)
  applications: JobApplication[]

  @OneToMany(() => SavedJob, (savedJob) => savedJob.job)
  savedJobs: SavedJob[]
}
