import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../../database/entities';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto';
import { NotFoundException, ConflictException, ForbiddenException } from '../../common/exceptions';
import { UserRole } from '../../common/enums';

/**
 * Applications Service
 * Xử lý logic liên quan đến hồ sơ ứng tuyển
 */
@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(JobApplication)
    private applicationsRepository: Repository<JobApplication>,
  ) {}

  /**
   * Nộp hồ sơ ứng tuyển
   */
  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { jobId, cvId } = createApplicationDto;

    // Kiểm tra đã ứng tuyển chưa
    const existing = await this.applicationsRepository.findOne({
      where: { jobId, userId },
    });

    if (existing) {
      throw new ConflictException('Bạn đã ứng tuyển công việc này rồi');
    }

    const application = this.applicationsRepository.create({
      jobId,
      cvId,
      userId,
    });

    const saved = await this.applicationsRepository.save(application);
    this.logger.log(`Application created: ${saved.id} by user ${userId}`);

    return this.findById(saved.id);
  }

  /**
   * Lấy danh sách hồ sơ ứng tuyển của tôi
   */
  async getMyApplications(userId: string, page: number = 1, limit: number = 10) {
    const [applications, total] = await this.applicationsRepository.findAndCount({
      where: { userId },
      relations: ['job', 'job.company', 'cv'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        appliedAt: 'DESC',
      },
    });

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy danh sách ứng viên cho công việc (dành cho nhà tuyển dụng)
   */
  async getApplicationsForJob(userId: string, jobId: string, page: number = 1, limit: number = 10) {
    // Kiểm tra quyền: phải là owner của job
    const application = await this.applicationsRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.id = :jobId', { jobId })
      .getOne();

    if (application && application.job.company.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem hồ sơ ứng tuyển của công việc này');
    }

    const [applications, total] = await this.applicationsRepository.findAndCount({
      where: { jobId },
      relations: ['cv', 'cv.experiences', 'cv.projects', 'cv.certifications'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        appliedAt: 'DESC',
      },
    });

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết hồ sơ ứng tuyển
   */
  async findById(id: string) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['job', 'job.company', 'cv', 'cv.experiences', 'cv.projects', 'cv.certifications'],
    });

    if (!application) {
      throw new NotFoundException('Hồ sơ ứng tuyển', id);
    }

    return { application };
  }

  /**
   * Cập nhật trạng thái hồ sơ (dành cho nhà tuyển dụng)
   */
  async updateStatus(
    userId: string,
    id: string,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['job', 'job.company'],
    });

    if (!application) {
      throw new NotFoundException('Hồ sơ ứng tuyển', id);
    }

    // Kiểm tra quyền
    if (application.job.company.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật hồ sơ này');
    }

    Object.assign(application, updateApplicationStatusDto);
    const updated = await this.applicationsRepository.save(application);

    this.logger.log(`Application updated: ${id}`);
    return this.findById(id);
  }

  /**
   * Rút hồ sơ ứng tuyển (dành cho ứng viên)
   */
  async withdraw(userId: string, id: string) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Hồ sơ ứng tuyển', id);
    }

    if (application.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền rút hồ sơ này');
    }

    await this.applicationsRepository.remove(application);
    this.logger.log(`Application withdrawn: ${id}`);

    return {};
  }
}

