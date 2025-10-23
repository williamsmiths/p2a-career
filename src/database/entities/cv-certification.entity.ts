import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cv } from './cv.entity';

/**
 * Entity CV Certification - Bảng cv_certifications chứa chứng chỉ/giải thưởng
 */
@Entity('cv_certifications')
export class CvCertification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cv_id', type: 'uuid' })
  cvId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'issued_by', length: 255, nullable: true })
  issuedBy: string | null;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: Date | null;

  @Column({ name: 'credential_url', type: 'text', nullable: true })
  credentialUrl: string | null;

  // Relations
  @ManyToOne(() => Cv, (cv) => cv.certifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_id' })
  cv: Cv;
}

