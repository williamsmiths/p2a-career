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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

/**
 * Applications Controller
 * Quản lý hồ sơ ứng tuyển
 */
@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Nộp hồ sơ ứng tuyển' })
  create(@CurrentUser('id') userId: string, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(userId, createApplicationDto);
  }

  @Get('me')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Lấy danh sách hồ sơ ứng tuyển của tôi' })
  getMyApplications(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.applicationsService.getMyApplications(userId, page, limit);
  }

  @Get('job/:jobId')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  @ApiOperation({ summary: 'Lấy danh sách ứng viên cho công việc (nhà tuyển dụng)' })
  getApplicationsForJob(
    @CurrentUser('id') userId: string,
    @Param('jobId') jobId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.applicationsService.getApplicationsForJob(userId, jobId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết hồ sơ ứng tuyển' })
  findById(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  @Put(':id/status')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  @ApiOperation({ summary: 'Cập nhật trạng thái hồ sơ (nhà tuyển dụng)' })
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(userId, id, updateApplicationStatusDto);
  }

  @Delete(':id')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Rút hồ sơ ứng tuyển' })
  withdraw(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.applicationsService.withdraw(userId, id);
  }
}

