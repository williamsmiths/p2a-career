import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv, CvExperience, CvProject, CvCertification } from '../../database/entities';
import { CreateCvDto, UpdateCvDto } from './dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';
import { UserRole } from '../../common/enums';

/**
 * CVs Service
 * Xử lý logic liên quan đến CV
 */
@Injectable()
export class CvsService {
  private readonly logger = new Logger(CvsService.name);

  constructor(
    @InjectRepository(Cv)
    private cvsRepository: Repository<Cv>,
    @InjectRepository(CvExperience)
    private cvExperiencesRepository: Repository<CvExperience>,
    @InjectRepository(CvProject)
    private cvProjectsRepository: Repository<CvProject>,
    @InjectRepository(CvCertification)
    private cvCertificationsRepository: Repository<CvCertification>,
  ) {}

  /**
   * Tạo CV mới
   */
  async create(userId: string, createCvDto: CreateCvDto) {
    const { experiences, projects, certifications, ...cvData } = createCvDto;

    // Tạo CV
    const cv = this.cvsRepository.create({
      ...cvData,
      userId,
    });

    const savedCv = await this.cvsRepository.save(cv);

    // Tạo experiences
    if (experiences && experiences.length > 0) {
      const cvExperiences = experiences.map((exp) =>
        this.cvExperiencesRepository.create({
          ...exp,
          cvId: savedCv.id,
        }),
      );
      await this.cvExperiencesRepository.save(cvExperiences);
    }

    // Tạo projects
    if (projects && projects.length > 0) {
      const cvProjects = projects.map((proj) =>
        this.cvProjectsRepository.create({
          ...proj,
          cvId: savedCv.id,
        }),
      );
      await this.cvProjectsRepository.save(cvProjects);
    }

    // Tạo certifications
    if (certifications && certifications.length > 0) {
      const cvCertifications = certifications.map((cert) =>
        this.cvCertificationsRepository.create({
          ...cert,
          cvId: savedCv.id,
        }),
      );
      await this.cvCertificationsRepository.save(cvCertifications);
    }

    this.logger.log(`CV created: ${savedCv.id} by user ${userId}`);

    // Load lại với relations
    return this.findById(savedCv.id);
  }

  /**
   * Lấy danh sách CV của user hiện tại
   */
  async getMyCvs(userId: string) {
    const cvs = await this.cvsRepository.find({
      where: { userId },
      relations: ['experiences', 'projects', 'certifications'],
      order: {
        createdAt: 'DESC',
      },
    });

    return { cvs };
  }

  /**
   * Lấy chi tiết CV
   */
  async findById(id: string) {
    const cv = await this.cvsRepository.findOne({
      where: { id },
      relations: ['experiences', 'projects', 'certifications'],
    });

    if (!cv) {
      throw new NotFoundException('CV', id);
    }

    return { cv };
  }

  /**
   * Cập nhật CV
   */
  async update(userId: string, userRole: string, id: string, updateCvDto: UpdateCvDto) {
    const cv = await this.cvsRepository.findOne({
      where: { id },
    });

    if (!cv) {
      throw new NotFoundException('CV', id);
    }

    // Chỉ owner hoặc admin mới được sửa
    if (cv.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền sửa CV này');
    }

    const { experiences, projects, certifications, ...cvData } = updateCvDto;

    // Update CV
    Object.assign(cv, cvData);
    await this.cvsRepository.save(cv);

    // Update experiences (delete all and re-create)
    if (experiences) {
      await this.cvExperiencesRepository.delete({ cvId: id });
      if (experiences.length > 0) {
        const cvExperiences = experiences.map((exp) =>
          this.cvExperiencesRepository.create({
            ...exp,
            cvId: id,
          }),
        );
        await this.cvExperiencesRepository.save(cvExperiences);
      }
    }

    // Update projects
    if (projects) {
      await this.cvProjectsRepository.delete({ cvId: id });
      if (projects.length > 0) {
        const cvProjects = projects.map((proj) =>
          this.cvProjectsRepository.create({
            ...proj,
            cvId: id,
          }),
        );
        await this.cvProjectsRepository.save(cvProjects);
      }
    }

    // Update certifications
    if (certifications) {
      await this.cvCertificationsRepository.delete({ cvId: id });
      if (certifications.length > 0) {
        const cvCertifications = certifications.map((cert) =>
          this.cvCertificationsRepository.create({
            ...cert,
            cvId: id,
          }),
        );
        await this.cvCertificationsRepository.save(cvCertifications);
      }
    }

    this.logger.log(`CV updated: ${id}`);
    return this.findById(id);
  }

  /**
   * Xóa CV
   */
  async delete(userId: string, userRole: string, id: string) {
    const cv = await this.cvsRepository.findOne({
      where: { id },
    });

    if (!cv) {
      throw new NotFoundException('CV', id);
    }

    if (cv.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa CV này');
    }

    await this.cvsRepository.remove(cv);
    this.logger.log(`CV deleted: ${id}`);

    return {};
  }
}

