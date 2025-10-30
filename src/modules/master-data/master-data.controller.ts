import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { UserRole, Roles, RolesGuard, Public } from '@common';

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

@Controller('master-data')
@UseGuards(RolesGuard)
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // Helpers: Map entity -> response with id là string
  private mapCountry(country: any) {
    return country
      ? {
          id: String(country.id),
          name: country.name,
          code: country.code ?? null,
          nameEn: country.nameEn ?? null,
          isActive: country.isActive,
        }
      : null;
  }

  private mapCity(city: any, includeCountry = false) {
    return city
      ? {
          id: String(city.id),
          name: city.name,
          nameEn: city.nameEn ?? null,
          countryId: String(city.countryId),
          isActive: city.isActive,
          ...(includeCountry && city.country
            ? { country: this.mapCountry(city.country) }
            : {}),
        }
      : null;
  }

  private mapDistrict(district: any, includeCity = false) {
    return district
      ? {
          id: String(district.id),
          name: district.name,
          nameEn: district.nameEn ?? null,
          cityId: String(district.cityId),
          isActive: district.isActive,
          ...(includeCity && district.city
            ? { city: this.mapCity(district.city, false) }
            : {}),
        }
      : null;
  }

  // ==================== COUNTRIES ====================
  @Public()
  @Get('countries')
  findAllCountries() {
    return this.masterDataService
      .findAllCountries()
      .then((items) => items.map((c) => this.mapCountry(c)));
  }

  @Public()
  @Get('countries/:id')
  findCountryById(@Param('id') id: string) {
    return this.masterDataService
      .findCountryById(id)
      .then((c) => this.mapCountry(c));
  }

  @Post('countries')
  @Roles(UserRole.ADMIN)
  createCountry(@Body() createCountryDto: CreateCountryDto) {
    return this.masterDataService.createCountry(createCountryDto);
  }

  @Patch('countries/:id')
  @Roles(UserRole.ADMIN)
  updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.masterDataService.updateCountry(id, updateCountryDto);
  }

  @Delete('countries/:id')
  @Roles(UserRole.ADMIN)
  deleteCountry(@Param('id') id: string) {
    return this.masterDataService.deleteCountry(id);
  }

  // ==================== CITIES ====================
  @Public()
  @Get('cities')
  findAllCities(@Query('countryId') countryId?: string) {
    return this.masterDataService
      .findAllCities(countryId)
      .then((items) => items.map((c) => this.mapCity(c, true)));
  }

  @Public()
  @Get('cities/:id')
  findCityById(@Param('id') id: string) {
    return this.masterDataService
      .findCityById(id)
      .then((c) => this.mapCity(c, true));
  }

  @Post('cities')
  @Roles(UserRole.ADMIN)
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.masterDataService.createCity(createCityDto);
  }

  @Patch('cities/:id')
  @Roles(UserRole.ADMIN)
  updateCity(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.masterDataService.updateCity(id, updateCityDto);
  }

  @Delete('cities/:id')
  @Roles(UserRole.ADMIN)
  deleteCity(@Param('id') id: string) {
    return this.masterDataService.deleteCity(id);
  }

  // ==================== DISTRICTS ====================
  @Public()
  @Get('districts')
  findAllDistricts(@Query('cityId') cityId?: string) {
    return this.masterDataService
      .findAllDistricts(cityId)
      .then((items) => items.map((d) => this.mapDistrict(d, true)));
  }

  @Public()
  @Get('districts/:id')
  findDistrictById(@Param('id') id: string) {
    return this.masterDataService
      .findDistrictById(id)
      .then((d) => this.mapDistrict(d, true));
  }

  @Post('districts')
  @Roles(UserRole.ADMIN)
  createDistrict(@Body() createDistrictDto: CreateDistrictDto) {
    return this.masterDataService.createDistrict(createDistrictDto);
  }

  @Patch('districts/:id')
  @Roles(UserRole.ADMIN)
  updateDistrict(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.masterDataService.updateDistrict(id, updateDistrictDto);
  }

  @Delete('districts/:id')
  @Roles(UserRole.ADMIN)
  deleteDistrict(@Param('id') id: string) {
    return this.masterDataService.deleteDistrict(id);
  }

  // ==================== INDUSTRIES ====================
  @Public()
  @Get('industries')
  findAllIndustries() {
    return this.masterDataService.findAllIndustries();
  }

  @Public()
  @Get('industries/:id')
  findIndustryById(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.findIndustryById(id);
  }

  @Post('industries')
  @Roles(UserRole.ADMIN)
  createIndustry(@Body() createIndustryDto: CreateIndustryDto) {
    return this.masterDataService.createIndustry(createIndustryDto);
  }

  @Patch('industries/:id')
  @Roles(UserRole.ADMIN)
  updateIndustry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ) {
    return this.masterDataService.updateIndustry(id, updateIndustryDto);
  }

  @Delete('industries/:id')
  @Roles(UserRole.ADMIN)
  deleteIndustry(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteIndustry(id);
  }

  // ==================== SKILLS ====================
  @Public()
  @Get('skills')
  findAllSkills(@Query('category') category?: string) {
    return this.masterDataService.findAllSkills(category);
  }

  @Public()
  @Get('skills/:id')
  findSkillById(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.findSkillById(id);
  }

  @Post('skills')
  @Roles(UserRole.ADMIN)
  createSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.masterDataService.createSkill(createSkillDto);
  }

  @Patch('skills/:id')
  @Roles(UserRole.ADMIN)
  updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.masterDataService.updateSkill(id, updateSkillDto);
  }

  @Delete('skills/:id')
  @Roles(UserRole.ADMIN)
  deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteSkill(id);
  }

  // ==================== POSITION LEVELS ====================
  @Public()
  @Get('position-levels')
  findAllPositionLevels() {
    return this.masterDataService.findAllPositionLevels();
  }

  @Public()
  @Get('position-levels/:id')
  findPositionLevelById(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.findPositionLevelById(id);
  }

  @Post('position-levels')
  @Roles(UserRole.ADMIN)
  createPositionLevel(@Body() createPositionLevelDto: CreatePositionLevelDto) {
    return this.masterDataService.createPositionLevel(createPositionLevelDto);
  }

  @Patch('position-levels/:id')
  @Roles(UserRole.ADMIN)
  updatePositionLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionLevelDto: UpdatePositionLevelDto,
  ) {
    return this.masterDataService.updatePositionLevel(id, updatePositionLevelDto);
  }

  @Delete('position-levels/:id')
  @Roles(UserRole.ADMIN)
  deletePositionLevel(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deletePositionLevel(id);
  }

  // ==================== EXPERIENCE LEVELS ====================
  @Public()
  @Get('experience-levels')
  findAllExperienceLevels() {
    return this.masterDataService.findAllExperienceLevels();
  }

  @Public()
  @Get('experience-levels/:id')
  findExperienceLevelById(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.findExperienceLevelById(id);
  }

  @Post('experience-levels')
  @Roles(UserRole.ADMIN)
  createExperienceLevel(@Body() createExperienceLevelDto: CreateExperienceLevelDto) {
    return this.masterDataService.createExperienceLevel(createExperienceLevelDto);
  }

  @Patch('experience-levels/:id')
  @Roles(UserRole.ADMIN)
  updateExperienceLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExperienceLevelDto: UpdateExperienceLevelDto,
  ) {
    return this.masterDataService.updateExperienceLevel(id, updateExperienceLevelDto);
  }

  @Delete('experience-levels/:id')
  @Roles(UserRole.ADMIN)
  deleteExperienceLevel(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteExperienceLevel(id);
  }

  // ==================== COMPANY SIZES ====================
  @Public()
  @Get('company-sizes')
  findAllCompanySizes() {
    return this.masterDataService.findAllCompanySizes();
  }

  @Public()
  @Get('company-sizes/:id')
  findCompanySizeById(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.findCompanySizeById(id);
  }

  @Post('company-sizes')
  @Roles(UserRole.ADMIN)
  createCompanySize(@Body() createCompanySizeDto: CreateCompanySizeDto) {
    return this.masterDataService.createCompanySize(createCompanySizeDto);
  }

  @Patch('company-sizes/:id')
  @Roles(UserRole.ADMIN)
  updateCompanySize(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanySizeDto: UpdateCompanySizeDto,
  ) {
    return this.masterDataService.updateCompanySize(id, updateCompanySizeDto);
  }

  @Delete('company-sizes/:id')
  @Roles(UserRole.ADMIN)
  deleteCompanySize(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteCompanySize(id);
  }
}
