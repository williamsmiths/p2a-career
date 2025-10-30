import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@common';

// Entities
import { Country } from '@entities';
import { City } from '@entities';
import { District } from '@entities';
import { Industry } from '@entities';
import { Skill } from '@entities';
import { PositionLevel } from '@entities';
import { ExperienceLevel } from '@entities';
import { CompanySize } from '@entities';
import { BusinessException, ErrorCode } from '@common';

// DTOs
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreatePositionLevelDto } from './dto/create-position-level.dto';
import { UpdatePositionLevelDto } from './dto/update-position-level.dto';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
import { CreateCompanySizeDto } from './dto/create-company-size.dto';
import { UpdateCompanySizeDto } from './dto/update-company-size.dto';

@Injectable()
export class MasterDataService {
  private readonly logger = new Logger(MasterDataService.name);

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

  // ==================== COUNTRIES ====================
  async findAllCountries(): Promise<Country[]> {
    return this.countriesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findCountryById(id: string): Promise<Country> {
    const country = await this.countriesRepository.findOne({ where: { id } });
    if (!country) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return country;
  }

  async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countriesRepository.create(createCountryDto);
    const saved = await this.countriesRepository.save(country);
    this.logger.log(`Country created: ${saved.id}`);
    return saved;
  }

  async updateCountry(id: string, updateCountryDto: UpdateCountryDto): Promise<Country> {
    const country = await this.findCountryById(id);
    Object.assign(country, updateCountryDto);
    const updated = await this.countriesRepository.save(country);
    this.logger.log(`Country updated: ${id}`);
    return updated;
  }

  async deleteCountry(id: string): Promise<void> {
    const country = await this.findCountryById(id);
    await this.countriesRepository.remove(country);
    this.logger.log(`Country deleted: ${id}`);
  }

  // ==================== CITIES ====================
  async findAllCities(countryId?: string): Promise<City[]> {
    const where: any = { isActive: true };
    if (countryId) {
      where.countryId = countryId;
    }
    
    return this.citiesRepository.find({
      where,
      relations: ['country'],
      order: { name: 'ASC' },
    });
  }

  async findCityById(id: string): Promise<City> {
    const city = await this.citiesRepository.findOne({ 
      where: { id },
      relations: ['country']
    });
    if (!city) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return city;
  }

  async createCity(createCityDto: CreateCityDto): Promise<City> {
    const city = this.citiesRepository.create(createCityDto);
    const saved = await this.citiesRepository.save(city);
    this.logger.log(`City created: ${saved.id}`);
    return saved;
  }

  async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.findCityById(id);
    Object.assign(city, updateCityDto);
    const updated = await this.citiesRepository.save(city);
    this.logger.log(`City updated: ${id}`);
    return updated;
  }

  async deleteCity(id: string): Promise<void> {
    const city = await this.findCityById(id);
    await this.citiesRepository.remove(city);
    this.logger.log(`City deleted: ${id}`);
  }

  // ==================== DISTRICTS ====================
  async findAllDistricts(cityId?: string): Promise<District[]> {
    const where: any = { isActive: true };
    if (cityId) {
      where.cityId = cityId;
    }
    
    return this.districtsRepository.find({
      where,
      relations: ['city'],
      order: { name: 'ASC' },
    });
  }

  async findDistrictById(id: string): Promise<District> {
    const district = await this.districtsRepository.findOne({ 
      where: { id },
      relations: ['city']
    });
    if (!district) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return district;
  }

  async createDistrict(createDistrictDto: CreateDistrictDto): Promise<District> {
    const district = this.districtsRepository.create(createDistrictDto);
    const saved = await this.districtsRepository.save(district);
    this.logger.log(`District created: ${saved.id}`);
    return saved;
  }

  async updateDistrict(id: string, updateDistrictDto: UpdateDistrictDto): Promise<District> {
    const district = await this.findDistrictById(id);
    Object.assign(district, updateDistrictDto);
    const updated = await this.districtsRepository.save(district);
    this.logger.log(`District updated: ${id}`);
    return updated;
  }

  async deleteDistrict(id: string): Promise<void> {
    const district = await this.findDistrictById(id);
    await this.districtsRepository.remove(district);
    this.logger.log(`District deleted: ${id}`);
  }

  // ==================== INDUSTRIES ====================
  async findAllIndustries(): Promise<Industry[]> {
    return this.industriesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findIndustryById(id: number): Promise<Industry> {
    const industry = await this.industriesRepository.findOne({ where: { id } });
    if (!industry) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return industry;
  }

  async createIndustry(createIndustryDto: CreateIndustryDto): Promise<Industry> {
    const industry = this.industriesRepository.create(createIndustryDto);
    const saved = await this.industriesRepository.save(industry);
    this.logger.log(`Industry created: ${saved.id}`);
    return saved;
  }

  async updateIndustry(id: number, updateIndustryDto: UpdateIndustryDto): Promise<Industry> {
    const industry = await this.findIndustryById(id);
    Object.assign(industry, updateIndustryDto);
    const updated = await this.industriesRepository.save(industry);
    this.logger.log(`Industry updated: ${id}`);
    return updated;
  }

  async deleteIndustry(id: number): Promise<void> {
    const industry = await this.findIndustryById(id);
    await this.industriesRepository.remove(industry);
    this.logger.log(`Industry deleted: ${id}`);
  }

  // ==================== SKILLS ====================
  async findAllSkills(category?: string): Promise<Skill[]> {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    
    return this.skillsRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findSkillById(id: number): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({ where: { id } });
    if (!skill) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return skill;
  }

  async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillsRepository.create(createSkillDto);
    const saved = await this.skillsRepository.save(skill);
    this.logger.log(`Skill created: ${saved.id}`);
    return saved;
  }

  async updateSkill(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findSkillById(id);
    Object.assign(skill, updateSkillDto);
    const updated = await this.skillsRepository.save(skill);
    this.logger.log(`Skill updated: ${id}`);
    return updated;
  }

  async deleteSkill(id: number): Promise<void> {
    const skill = await this.findSkillById(id);
    await this.skillsRepository.remove(skill);
    this.logger.log(`Skill deleted: ${id}`);
  }

  // ==================== POSITION LEVELS ====================
  async findAllPositionLevels(): Promise<PositionLevel[]> {
    return this.positionLevelsRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findPositionLevelById(id: number): Promise<PositionLevel> {
    const positionLevel = await this.positionLevelsRepository.findOne({ where: { id } });
    if (!positionLevel) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return positionLevel;
  }

  async createPositionLevel(createPositionLevelDto: CreatePositionLevelDto): Promise<PositionLevel> {
    const positionLevel = this.positionLevelsRepository.create(createPositionLevelDto);
    const saved = await this.positionLevelsRepository.save(positionLevel);
    this.logger.log(`PositionLevel created: ${saved.id}`);
    return saved;
  }

  async updatePositionLevel(id: number, updatePositionLevelDto: UpdatePositionLevelDto): Promise<PositionLevel> {
    const positionLevel = await this.findPositionLevelById(id);
    Object.assign(positionLevel, updatePositionLevelDto);
    const updated = await this.positionLevelsRepository.save(positionLevel);
    this.logger.log(`PositionLevel updated: ${id}`);
    return updated;
  }

  async deletePositionLevel(id: number): Promise<void> {
    const positionLevel = await this.findPositionLevelById(id);
    await this.positionLevelsRepository.remove(positionLevel);
    this.logger.log(`PositionLevel deleted: ${id}`);
  }

  // ==================== EXPERIENCE LEVELS ====================
  async findAllExperienceLevels(): Promise<ExperienceLevel[]> {
    return this.experienceLevelsRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findExperienceLevelById(id: number): Promise<ExperienceLevel> {
    const experienceLevel = await this.experienceLevelsRepository.findOne({ where: { id } });
    if (!experienceLevel) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return experienceLevel;
  }

  async createExperienceLevel(createExperienceLevelDto: CreateExperienceLevelDto): Promise<ExperienceLevel> {
    const experienceLevel = this.experienceLevelsRepository.create(createExperienceLevelDto);
    const saved = await this.experienceLevelsRepository.save(experienceLevel);
    this.logger.log(`ExperienceLevel created: ${saved.id}`);
    return saved;
  }

  async updateExperienceLevel(id: number, updateExperienceLevelDto: UpdateExperienceLevelDto): Promise<ExperienceLevel> {
    const experienceLevel = await this.findExperienceLevelById(id);
    Object.assign(experienceLevel, updateExperienceLevelDto);
    const updated = await this.experienceLevelsRepository.save(experienceLevel);
    this.logger.log(`ExperienceLevel updated: ${id}`);
    return updated;
  }

  async deleteExperienceLevel(id: number): Promise<void> {
    const experienceLevel = await this.findExperienceLevelById(id);
    await this.experienceLevelsRepository.remove(experienceLevel);
    this.logger.log(`ExperienceLevel deleted: ${id}`);
  }

  // ==================== COMPANY SIZES ====================
  async findAllCompanySizes(): Promise<CompanySize[]> {
    return this.companySizesRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findCompanySizeById(id: number): Promise<CompanySize> {
    const companySize = await this.companySizesRepository.findOne({ where: { id } });
    if (!companySize) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    return companySize;
  }

  async createCompanySize(createCompanySizeDto: CreateCompanySizeDto): Promise<CompanySize> {
    const companySize = this.companySizesRepository.create(createCompanySizeDto);
    const saved = await this.companySizesRepository.save(companySize);
    this.logger.log(`CompanySize created: ${saved.id}`);
    return saved;
  }

  async updateCompanySize(id: number, updateCompanySizeDto: UpdateCompanySizeDto): Promise<CompanySize> {
    const companySize = await this.findCompanySizeById(id);
    Object.assign(companySize, updateCompanySizeDto);
    const updated = await this.companySizesRepository.save(companySize);
    this.logger.log(`CompanySize updated: ${id}`);
    return updated;
  }

  async deleteCompanySize(id: number): Promise<void> {
    const companySize = await this.findCompanySizeById(id);
    await this.companySizesRepository.remove(companySize);
    this.logger.log(`CompanySize deleted: ${id}`);
  }
 
}
