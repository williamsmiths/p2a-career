import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { BusinessException, ErrorCode } from '@common';
import { UserRole } from '@common';

/**
 * Companies Service
 * Xử lý logic liên quan đến công ty
 */
@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  /**
   * Tạo hồ sơ công ty (1 user chỉ có 1 company)
   */
  async create(userId: string, createCompanyDto: CreateCompanyDto) {
    // Kiểm tra đã có company chưa
    const existing = await this.companiesRepository.findOne({
      where: { userId },
    });

    if (existing) {
      throw new BusinessException(ErrorCode.CONFLICT);
    }

    const company = this.companiesRepository.create({
      ...createCompanyDto,
      userId,
    });

    const saved = await this.companiesRepository.save(company);
    this.logger.log(`Company created: ${saved.id} by user ${userId}`);

    return { company: saved };
  }

  /**
   * Lấy hồ sơ công ty của user hiện tại
   */
  async getMyCompany(userId: string) {
    const company = await this.companiesRepository.findOne({
      where: { userId },
    });

    if (!company) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    return { company };
  }

  /**
   * Cập nhật hồ sơ công ty
   */
  async update(userId: string, userRole: string, id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    // Chỉ owner hoặc admin mới được sửa
    if (company.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new BusinessException(ErrorCode.FORBIDDEN);
    }

    Object.assign(company, updateCompanyDto);
    const updated = await this.companiesRepository.save(company);

    this.logger.log(`Company updated: ${id}`);
    return { company: updated };
  }

  /**
   * Lấy thông tin công ty theo ID (public)
   */
  async findById(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['jobs'],
    });

    if (!company) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    return { company };
  }

  /**
   * Lấy danh sách tất cả công ty (public)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const [companies, total] = await this.companiesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Xóa công ty (chỉ owner hoặc admin)
   */
  async delete(userId: string, userRole: string, id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    if (company.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new BusinessException(ErrorCode.FORBIDDEN);
    }

    await this.companiesRepository.remove(company);
    this.logger.log(`Company deleted: ${id}`);

    return {};
  }
}

