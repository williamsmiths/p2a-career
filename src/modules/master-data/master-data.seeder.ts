import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { Country, City, District, Industry, Skill, PositionLevel, ExperienceLevel, CompanySize } from '@entities';

@Injectable()
export class MasterDataSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(MasterDataSeeder.name);

  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(District)
    private readonly districtsRepository: Repository<District>,
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
      this.seedLocations(),
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

  private async seedLocations(): Promise<void> {
    const countriesCount = await this.countriesRepository.count();
    if (countriesCount > 0) return;

    // Danh sách quốc gia ASEAN
    const aseanCountries: Partial<Country>[] = [
      { name: 'Brunei', nameEn: 'Brunei', code: 'BN', isActive: true },
      { name: 'Campuchia', nameEn: 'Cambodia', code: 'KH', isActive: true },
      { name: 'Indonesia', nameEn: 'Indonesia', code: 'ID', isActive: true },
      { name: 'Lào', nameEn: 'Laos', code: 'LA', isActive: true },
      { name: 'Malaysia', nameEn: 'Malaysia', code: 'MY', isActive: true },
      { name: 'Myanmar', nameEn: 'Myanmar', code: 'MM', isActive: true },
      { name: 'Philippines', nameEn: 'Philippines', code: 'PH', isActive: true },
      { name: 'Singapore', nameEn: 'Singapore', code: 'SG', isActive: true },
      { name: 'Thái Lan', nameEn: 'Thailand', code: 'TH', isActive: true },
      { name: 'Việt Nam', nameEn: 'Vietnam', code: 'VN', isActive: true },
    ];

    const savedCountries = await this.countriesRepository.save(
      aseanCountries.map((c) => this.countriesRepository.create(c)) as Country[],
    );

    const codeToId = new Map<string, string>();
    for (const c of savedCountries) {
      if (c.code) codeToId.set(c.code, c.id);
    }

    // Một số thành phố tiêu biểu theo từng quốc gia ASEAN
    const cities: Partial<City>[] = [];

    // Brunei (BN)
    if (codeToId.has('BN')) {
      const countryId = codeToId.get('BN')!;
      cities.push(
        { name: 'Bandar Seri Begawan', nameEn: 'Bandar Seri Begawan', countryId, isActive: true },
        { name: 'Kuala Belait', nameEn: 'Kuala Belait', countryId, isActive: true },
      );
    }

    // Campuchia (KH)
    if (codeToId.has('KH')) {
      const countryId = codeToId.get('KH')!;
      cities.push(
        { name: 'Phnom Penh', nameEn: 'Phnom Penh', countryId, isActive: true },
        { name: 'Siem Reap', nameEn: 'Siem Reap', countryId, isActive: true },
        { name: 'Sihanoukville', nameEn: 'Sihanoukville', countryId, isActive: true },
      );
    }

    // Indonesia (ID)
    if (codeToId.has('ID')) {
      const countryId = codeToId.get('ID')!;
      cities.push(
        { name: 'Jakarta', nameEn: 'Jakarta', countryId, isActive: true },
        { name: 'Surabaya', nameEn: 'Surabaya', countryId, isActive: true },
        { name: 'Bandung', nameEn: 'Bandung', countryId, isActive: true },
        { name: 'Medan', nameEn: 'Medan', countryId, isActive: true },
      );
    }

    // Lào (LA)
    if (codeToId.has('LA')) {
      const countryId = codeToId.get('LA')!;
      cities.push(
        { name: 'Viêng Chăn', nameEn: 'Vientiane', countryId, isActive: true },
        { name: 'Luang Prabang', nameEn: 'Luang Prabang', countryId, isActive: true },
        { name: 'Pakse', nameEn: 'Pakse', countryId, isActive: true },
      );
    }

    // Malaysia (MY)
    if (codeToId.has('MY')) {
      const countryId = codeToId.get('MY')!;
      cities.push(
        { name: 'Kuala Lumpur', nameEn: 'Kuala Lumpur', countryId, isActive: true },
        { name: 'George Town', nameEn: 'George Town', countryId, isActive: true },
        { name: 'Johor Bahru', nameEn: 'Johor Bahru', countryId, isActive: true },
      );
    }

    // Myanmar (MM)
    if (codeToId.has('MM')) {
      const countryId = codeToId.get('MM')!;
      cities.push(
        { name: 'Yangon', nameEn: 'Yangon', countryId, isActive: true },
        { name: 'Naypyidaw', nameEn: 'Naypyidaw', countryId, isActive: true },
        { name: 'Mandalay', nameEn: 'Mandalay', countryId, isActive: true },
      );
    }

    // Philippines (PH)
    if (codeToId.has('PH')) {
      const countryId = codeToId.get('PH')!;
      cities.push(
        { name: 'Manila', nameEn: 'Manila', countryId, isActive: true },
        { name: 'Quezon City', nameEn: 'Quezon City', countryId, isActive: true },
        { name: 'Cebu City', nameEn: 'Cebu City', countryId, isActive: true },
      );
    }

    // Singapore (SG)
    if (codeToId.has('SG')) {
      const countryId = codeToId.get('SG')!;
      cities.push(
        { name: 'Singapore', nameEn: 'Singapore', countryId, isActive: true },
      );
    }

    // Thái Lan (TH)
    if (codeToId.has('TH')) {
      const countryId = codeToId.get('TH')!;
      cities.push(
        { name: 'Bangkok', nameEn: 'Bangkok', countryId, isActive: true },
        { name: 'Chiang Mai', nameEn: 'Chiang Mai', countryId, isActive: true },
        { name: 'Pattaya', nameEn: 'Pattaya', countryId, isActive: true },
      );
    }

    // Việt Nam (VN)
    if (codeToId.has('VN')) {
      const countryId = codeToId.get('VN')!;
      cities.push(
        { name: 'Hà Nội', nameEn: 'Hanoi', countryId, isActive: true },
        { name: 'Hồ Chí Minh', nameEn: 'Ho Chi Minh City', countryId, isActive: true },
        { name: 'Đà Nẵng', nameEn: 'Da Nang', countryId, isActive: true },
        { name: 'Cần Thơ', nameEn: 'Can Tho', countryId, isActive: true },
        { name: 'Hải Phòng', nameEn: 'Hai Phong', countryId, isActive: true },
      );
    }

    const savedCities = await this.citiesRepository.save(
      cities.map((c) => this.citiesRepository.create(c)) as City[],
    );

    // Tạo một vài quận minh họa cho TP.HCM (tùy chọn)
    const hcm = savedCities.find((c) => c.name === 'Hồ Chí Minh');
    if (hcm) {
      const districtsHcm: Partial<District>[] = [
        { name: 'Quận 1', nameEn: 'District 1', cityId: hcm.id, isActive: true },
        { name: 'Quận 3', nameEn: 'District 3', cityId: hcm.id, isActive: true },
        { name: 'Quận 7', nameEn: 'District 7', cityId: hcm.id, isActive: true },
      ];
      await this.districtsRepository.insert(districtsHcm as District[]);
    }

    this.logger.log('Seeded ASEAN locations (countries, cities, districts)');
  }
}


