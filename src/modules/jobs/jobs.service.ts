import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Job } from '@entities';
import { CreateJobDto, UpdateJobDto, FilterJobsDto } from './dto';
import { BusinessException, ErrorCode } from '@common';
import { UserRole, JobStatus } from '@common';
import { CompaniesService } from '../companies/companies.service';

/**
 * Jobs Service
 * Xử lý logic liên quan đến tin tuyển dụng
 */
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private companiesService: CompaniesService,
  ) {}

  /**
   * Tạo tin tuyển dụng
   */
  async create(userId: string, createJobDto: CreateJobDto) {
    // Lấy company của user
    const { company } = await this.companiesService.getMyCompany(userId);

    const job = this.jobsRepository.create({
      ...createJobDto,
      companyId: company.id,
    });

    const saved = await this.jobsRepository.save(job);
    this.logger.log(`Job created: ${saved.id} by company ${company.id}`);

    return { job: saved };
  }

  /**
   * Lấy danh sách tin tuyển dụng với filter
   */
  async findAll(filterJobsDto: FilterJobsDto) {
    const { keyword, jobType, status, cityId, isRemote, isUrgent, companyId, page, limit } =
      filterJobsDto;

    const query = this.jobsRepository.createQueryBuilder('job');

    // Join company
    query.leftJoinAndSelect('job.company', 'company');

    // Filter by keyword
    if (keyword) {
      query.andWhere('(job.title LIKE :keyword OR job.description LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    // Filter by job type
    if (jobType) {
      query.andWhere('job.jobType = :jobType', { jobType });
    }

    // Filter by status
    if (status) {
      query.andWhere('job.status = :status', { status });
    }

    // Filter by city
    if (cityId) {
      query.andWhere('job.cityId = :cityId', { cityId });
    }

    // Filter by remote
    if (isRemote !== undefined) {
      query.andWhere('job.isRemote = :isRemote', { isRemote });
    }

    // Filter by urgent
    if (isUrgent !== undefined) {
      query.andWhere('job.isUrgent = :isUrgent', { isUrgent });
    }

    // Filter by company
    if (companyId) {
      query.andWhere('job.companyId = :companyId', { companyId });
    }

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // Order
    query.orderBy('job.createdAt', 'DESC');

    const [jobs, total] = await query.getManyAndCount();

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết tin tuyển dụng
   */
  async findById(id: string) {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!job) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    // Tăng view count
    job.viewCount += 1;
    await this.jobsRepository.save(job);

    return { job };
  }

  /**
   * Cập nhật tin tuyển dụng
   */
  async update(userId: string, userRole: string, id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!job) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    // Chỉ owner company hoặc admin mới được sửa
    if (job.company.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new BusinessException(ErrorCode.FORBIDDEN);
    }

    Object.assign(job, updateJobDto);
    const updated = await this.jobsRepository.save(job);

    this.logger.log(`Job updated: ${id}`);
    return { job: updated };
  }

  /**
   * Xóa tin tuyển dụng
   */
  async delete(userId: string, userRole: string, id: string) {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!job) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    if (job.company.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new BusinessException(ErrorCode.FORBIDDEN);
    }

    await this.jobsRepository.remove(job);
    this.logger.log(`Job deleted: ${id}`);

    return {};
  }

  /**
   * Lấy danh sách tin tuyển dụng của công ty tôi
   */
  async getMyJobs(userId: string, page: number = 1, limit: number = 10) {
    const { company } = await this.companiesService.getMyCompany(userId);

    const [jobs, total] = await this.jobsRepository.findAndCount({
      where: { companyId: company.id },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

