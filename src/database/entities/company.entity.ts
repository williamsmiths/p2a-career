import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CompanyType, VerificationStatus } from '../../common/enums';
import { Job } from './job.entity';

/**
 * Entity Company - Bảng companies chứa thông tin công ty
 */
@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'tax_id', length: 50, nullable: true, unique: true })
  taxId: string | null;

  @Column({
    name: 'company_type',
    type: 'enum',
    enum: CompanyType,
    default: CompanyType.ENTERPRISE,
  })
  companyType: CompanyType;

  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.UNVERIFIED,
  })
  verificationStatus: VerificationStatus;

  @Column({ name: 'company_size_id', type: 'int', nullable: true })
  companySizeId: number | null;

  @Column({ type: 'text', nullable: true })
  website: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'contact_email', length: 255, nullable: true })
  contactEmail: string | null;

  @Column({ name: 'contact_phone', length: 50, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'city_id', type: 'int', nullable: true })
  cityId: number | null;

  @Column({ name: 'street_address', type: 'text', nullable: true })
  streetAddress: string | null;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string | null;

  @Column({ name: 'banner_url', type: 'text', nullable: true })
  bannerUrl: string | null;

  // Employer Branding fields
  @Column({ name: 'working_days', length: 255, nullable: true })
  workingDays: string | null;

  @Column({ name: 'overtime_policy', type: 'text', nullable: true })
  overtimePolicy: string | null;

  @Column({ name: 'company_culture_photos', type: 'jsonb', nullable: true })
  companyCulturePhotos: string[] | null;

  @Column({ name: 'why_you_love_working_here', type: 'text', nullable: true })
  whyYouLoveWorkingHere: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}

