import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CvExperience } from './cv-experience.entity';
import { CvProject } from './cv-project.entity';
import { CvCertification } from './cv-certification.entity';
import { JobApplication } from './job-application.entity';

/**
 * Entity CV - Bảng cvs chứa thông tin CV của ứng viên
 */
@Entity('cvs')
export class Cv {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'career_objective', type: 'text', nullable: true })
  careerObjective: string | null;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

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
  @OneToMany(() => CvExperience, (experience) => experience.cv)
  experiences: CvExperience[];

  @OneToMany(() => CvProject, (project) => project.cv)
  projects: CvProject[];

  @OneToMany(() => CvCertification, (certification) => certification.cv)
  certifications: CvCertification[];

  @OneToMany(() => JobApplication, (application) => application.cv)
  applications: JobApplication[];
}

