import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Job } from '@entities'
import { ApproveJobDto, RejectJobDto } from './dto'
import { BusinessException, ErrorCode, JobStatus, JobType } from '@common'
import { NotificationsService } from '../notifications/notifications.service'

/**
 * Admin Service
 * Xử lý logic admin cho việc quản lý jobs/internships
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)

  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private notificationsService: NotificationsService
  ) {}

  /**
   * Lấy hàng đợi các tin Internship đang chờ duyệt
   */
  async getInternshipQueue(page: number = 1, limit: number = 10) {
    const query = this.jobsRepository.createQueryBuilder('job')

    // Chỉ lấy internship và status = PENDING
    query
      .where('job.jobType = :jobType', { jobType: JobType.INTERNSHIP })
      .andWhere('job.status = :status', { status: JobStatus.PENDING })
      .leftJoinAndSelect('job.company', 'company')
      .orderBy('job.createdAt', 'ASC')

    // Pagination
    const skip = (page - 1) * limit
    query.skip(skip).take(limit)

    const [jobs, total] = await query.getManyAndCount()

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Lấy tất cả jobs đang chờ duyệt (không chỉ internship)
   */
  async getPendingJobs(page: number = 1, limit: number = 10) {
    const query = this.jobsRepository.createQueryBuilder('job')

    query
      .where('job.status = :status', { status: JobStatus.PENDING })
      .leftJoinAndSelect('job.company', 'company')
      .orderBy('job.createdAt', 'ASC')

    const skip = (page - 1) * limit
    query.skip(skip).take(limit)

    const [jobs, total] = await query.getManyAndCount()

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Phê duyệt một tin tuyển dụng
   */
  async approveJob(adminId: string, jobId: string, approveJobDto: ApproveJobDto) {
    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
      relations: ['company']
    })

    if (!job) {
      throw new BusinessException(ErrorCode.NOT_FOUND)
    }

    if (job.status !== JobStatus.PENDING) {
      throw new BusinessException(ErrorCode.CONFLICT, 'Job is not in pending status')
    }

    job.status = JobStatus.APPROVED
    job.approvedBy = adminId
    job.approvedAt = new Date()

    const updated = await this.jobsRepository.save(job)
    this.logger.log(`Job ${jobId} approved by admin ${adminId}`)

    // Send notifications
    await this.notificationsService.sendAllNotificationsOnApproval(updated)

    return { job: updated }
  }

  /**
   * Từ chối một tin tuyển dụng
   */
  async rejectJob(adminId: string, jobId: string, rejectJobDto: RejectJobDto) {
    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
      relations: ['company']
    })

    if (!job) {
      throw new BusinessException(ErrorCode.NOT_FOUND)
    }

    if (job.status !== JobStatus.PENDING) {
      throw new BusinessException(ErrorCode.CONFLICT, 'Job is not in pending status')
    }

    job.status = JobStatus.REJECTED
    job.rejectionReason = rejectJobDto.rejectionReason
    job.approvedBy = adminId
    job.approvedAt = new Date()

    const updated = await this.jobsRepository.save(job)
    this.logger.log(`Job ${jobId} rejected by admin ${adminId}`)

    // Send rejection notification
    await this.notificationsService.notifyJobRejected(updated, rejectJobDto.rejectionReason)

    return { job: updated }
  }

  /**
   * Lấy thống kê tổng quan
   */
  async getStatistics() {
    const [totalPending, totalApproved, totalRejected, totalInternshipPending] = await Promise.all([
      this.jobsRepository.count({ where: { status: JobStatus.PENDING } }),
      this.jobsRepository.count({ where: { status: JobStatus.APPROVED } }),
      this.jobsRepository.count({ where: { status: JobStatus.REJECTED } }),
      this.jobsRepository.count({
        where: {
          status: JobStatus.PENDING,
          jobType: JobType.INTERNSHIP
        }
      })
    ])

    return {
      statistics: {
        totalPending,
        totalApproved,
        totalRejected,
        totalInternshipPending
      }
    }
  }
}
