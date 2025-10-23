import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { CurrentUser, Public, Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

/**
 * Companies Controller
 * Quản lý hồ sơ công ty
 */
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  @ApiOperation({ summary: 'Tạo hồ sơ công ty' })
  create(@CurrentUser('id') userId: string, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(userId, createCompanyDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  @ApiOperation({ summary: 'Lấy hồ sơ công ty của tôi' })
  getMyCompany(@CurrentUser('id') userId: string) {
    return this.companiesService.getMyCompany(userId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách tất cả công ty' })
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.companiesService.findAll(page, limit);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin công ty theo ID' })
  findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật hồ sơ công ty' })
  update(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(userId, userRole, id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa công ty' })
  delete(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
  ) {
    return this.companiesService.delete(userId, userRole, id);
  }
}

