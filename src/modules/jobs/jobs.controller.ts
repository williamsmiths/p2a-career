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
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, FilterJobsDto } from './dto';
import { CurrentUser, Public, Roles, UserRole } from '@common';

/**
 * Jobs Controller
 * Quản lý tin tuyển dụng
 */
@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  @ApiOperation({ summary: 'Tạo tin tuyển dụng' })
  create(@CurrentUser('id') userId: string, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(userId, createJobDto);
  }

  @Get('my-jobs')
  @ApiBearerAuth()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  @ApiOperation({ summary: 'Lấy danh sách tin tuyển dụng của công ty tôi' })
  getMyJobs(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.jobsService.getMyJobs(userId, page, limit);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách tin tuyển dụng với filter' })
  findAll(@Query() filterJobsDto: FilterJobsDto) {
    return this.jobsService.findAll(filterJobsDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết tin tuyển dụng' })
  findById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật tin tuyển dụng' })
  update(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(userId, userRole, id, updateJobDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tin tuyển dụng' })
  delete(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
  ) {
    return this.jobsService.delete(userId, userRole, id);
  }
}

