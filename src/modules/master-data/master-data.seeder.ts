import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { Industry, Skill, PositionLevel, ExperienceLevel, CompanySize } from '@entities';

@Injectable()
export class MasterDataSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(MasterDataSeeder.name);

  constructor(
    @InjectRepository(Industry)
    private readonly industriesRepository: Repository<Industry>,
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
    @InjectRepository(PositionLevel)
    private readonly positionLevelsRepository: Repository<PositionLevel>,
    @InjectRepository(ExperienceLevel)
    private readonly experienceLevelsRepository: Repository<ExperienceLevel>,
    @InjectRepository(CompanySize)
    private readonly companySizesRepository: Repository<CompanySize>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedMasterDataIfEmpty();
  }

  private async seedMasterDataIfEmpty(): Promise<void> {
    await Promise.all([
      this.seedPositionLevels(),
      this.seedExperienceLevels(),
      this.seedCompanySizes(),
      this.seedIndustries(),
      this.seedSkills(),
    ]);
  }

  private async seedPositionLevels(): Promise<void> {
    const count = await this.positionLevelsRepository.count();
    if (count > 0) return;
    const items: Partial<PositionLevel>[] = [
      { name: 'Intern', nameEn: 'Intern', sortOrder: 10, isActive: true },
      { name: 'Junior', nameEn: 'Junior', sortOrder: 20, isActive: true },
      { name: 'Mid', nameEn: 'Mid', sortOrder: 30, isActive: true },
      { name: 'Senior', nameEn: 'Senior', sortOrder: 40, isActive: true },
      { name: 'Lead', nameEn: 'Lead', sortOrder: 50, isActive: true },
      { name: 'Manager', nameEn: 'Manager', sortOrder: 60, isActive: true },
      { name: 'Director', nameEn: 'Director', sortOrder: 70, isActive: true },
    ];
    await this.positionLevelsRepository.insert(items as PositionLevel[]);
    this.logger.log('Seeded position levels');
  }

  private async seedExperienceLevels(): Promise<void> {
    const count = await this.experienceLevelsRepository.count();
    if (count > 0) return;
    const items: Partial<ExperienceLevel>[] = [
      { name: 'Chưa có kinh nghiệm', nameEn: 'No experience', minYears: 0, maxYears: 0, sortOrder: 10, isActive: true },
      { name: '0 - 1 năm', nameEn: '0 - 1 years', minYears: 0, maxYears: 1, sortOrder: 20, isActive: true },
      { name: '1 - 3 năm', nameEn: '1 - 3 years', minYears: 1, maxYears: 3, sortOrder: 30, isActive: true },
      { name: '3 - 5 năm', nameEn: '3 - 5 years', minYears: 3, maxYears: 5, sortOrder: 40, isActive: true },
      { name: '5 - 7 năm', nameEn: '5 - 7 years', minYears: 5, maxYears: 7, sortOrder: 50, isActive: true },
      { name: '7 - 10 năm', nameEn: '7 - 10 years', minYears: 7, maxYears: 10, sortOrder: 60, isActive: true },
      { name: 'Trên 10 năm', nameEn: '10+ years', minYears: 10, maxYears: null, sortOrder: 70, isActive: true },
    ];
    await this.experienceLevelsRepository.insert(items as ExperienceLevel[]);
    this.logger.log('Seeded experience levels');
  }

  private async seedCompanySizes(): Promise<void> {
    const count = await this.companySizesRepository.count();
    if (count > 0) return;
    const items: Partial<CompanySize>[] = [
      { name: '1 - 9 nhân sự', nameEn: '1 - 9 employees', minEmployees: 1, maxEmployees: 9, sortOrder: 10, isActive: true },
      { name: '10 - 49 nhân sự', nameEn: '10 - 49 employees', minEmployees: 10, maxEmployees: 49, sortOrder: 20, isActive: true },
      { name: '50 - 99 nhân sự', nameEn: '50 - 99 employees', minEmployees: 50, maxEmployees: 99, sortOrder: 30, isActive: true },
      { name: '100 - 499 nhân sự', nameEn: '100 - 499 employees', minEmployees: 100, maxEmployees: 499, sortOrder: 40, isActive: true },
      { name: '500 - 999 nhân sự', nameEn: '500 - 999 employees', minEmployees: 500, maxEmployees: 999, sortOrder: 50, isActive: true },
      { name: '1000+ nhân sự', nameEn: '1000+ employees', minEmployees: 1000, maxEmployees: null, sortOrder: 60, isActive: true },
    ];
    await this.companySizesRepository.insert(items as CompanySize[]);
    this.logger.log('Seeded company sizes');
  }

  private async seedIndustries(): Promise<void> {
    const count = await this.industriesRepository.count();
    if (count > 0) return;
    const items: Partial<Industry>[] = [
      { name: 'Công nghệ thông tin', nameEn: 'Information Technology', isActive: true },
      { name: 'Tài chính', nameEn: 'Finance', isActive: true },
      { name: 'Giáo dục', nameEn: 'Education', isActive: true },
      { name: 'Y tế', nameEn: 'Healthcare', isActive: true },
      { name: 'Thương mại điện tử', nameEn: 'E-commerce', isActive: true },
    ];
    await this.industriesRepository.insert(items as Industry[]);
    this.logger.log('Seeded industries');
  }

  private async seedSkills(): Promise<void> {
    const count = await this.skillsRepository.count();
    if (count > 0) return;
    const items: Partial<Skill>[] = [
      { name: 'JavaScript', nameEn: 'JavaScript', category: 'Programming', isActive: true },
      { name: 'TypeScript', nameEn: 'TypeScript', category: 'Programming', isActive: true },
      { name: 'Node.js', nameEn: 'Node.js', category: 'Backend', isActive: true },
      { name: 'NestJS', nameEn: 'NestJS', category: 'Backend', isActive: true },
      { name: 'SQL', nameEn: 'SQL', category: 'Database', isActive: true },
    ];
    await this.skillsRepository.insert(items as Skill[]);
    this.logger.log('Seeded skills');
  }
}


