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
