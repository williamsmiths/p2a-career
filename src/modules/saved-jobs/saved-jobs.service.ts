import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from '../../database/entities';
import { NotFoundException, ConflictException } from '../../common/exceptions';

/**
 * Saved Jobs Service
 * Xử lý logic liên quan đến công việc đã lưu
 */
@Injectable()
export class SavedJobsService {
  private readonly logger = new Logger(SavedJobsService.name);

  constructor(
    @InjectRepository(SavedJob)
    private savedJobsRepository: Repository<SavedJob>,
  ) {}

  /**
   * Lưu công việc
   */
  async save(userId: string, jobId: string) {
    // Kiểm tra đã lưu chưa
    const existing = await this.savedJobsRepository.findOne({
      where: { userId, jobId },
    });

    if (existing) {
      throw new ConflictException('Bạn đã lưu công việc này rồi');
    }

    const savedJob = this.savedJobsRepository.create({
      userId,
      jobId,
    });

    await this.savedJobsRepository.save(savedJob);
    this.logger.log(`Job saved: ${jobId} by user ${userId}`);

    return { message: 'Đã lưu công việc thành công' };
  }

  /**
   * Lấy danh sách công việc đã lưu
   */
  async getMySavedJobs(userId: string, page: number = 1, limit: number = 10) {
    const [savedJobs, total] = await this.savedJobsRepository.findAndCount({
      where: { userId },
      relations: ['job', 'job.company'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        savedAt: 'DESC',
      },
    });

    return {
      savedJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Bỏ lưu công việc
   */
  async unsave(userId: string, jobId: string) {
    const savedJob = await this.savedJobsRepository.findOne({
      where: { userId, jobId },
    });

    if (!savedJob) {
      throw new NotFoundException('Công việc đã lưu');
    }

    await this.savedJobsRepository.remove(savedJob);
    this.logger.log(`Job unsaved: ${jobId} by user ${userId}`);

    return { message: 'Đã bỏ lưu công việc thành công' };
  }

  /**
   * Kiểm tra đã lưu công việc chưa
   */
  async isSaved(userId: string, jobId: string) {
    const savedJob = await this.savedJobsRepository.findOne({
      where: { userId, jobId },
    });

    return { isSaved: !!savedJob };
  }
}

