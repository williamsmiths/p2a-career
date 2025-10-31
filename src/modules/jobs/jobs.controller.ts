import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { CreateJobDto, UpdateJobDto, FilterJobsDto } from './dto'
import { CurrentUser, Public, Roles, UserRole } from '@common'

/**
 * Jobs Controller
 * Quản lý tin tuyển dụng
 */
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  create(@CurrentUser('id') userId: string, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(userId, createJobDto)
  }

  @Get('my-jobs')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  getMyJobs(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.jobsService.getMyJobs(userId, page, limit)
  }

  @Get()
  @Public()
  findAll(@Query() filterJobsDto: FilterJobsDto) {
    return this.jobsService.findAll(filterJobsDto)
  }

  @Get(':id')
  @Public()
  findById(@Param('id') id: string) {
    return this.jobsService.findById(id)
  }

  @Put(':id')
  update(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto
  ) {
    return this.jobsService.update(userId, userRole, id, updateJobDto)
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: string, @CurrentUser('role') userRole: string, @Param('id') id: string) {
    return this.jobsService.delete(userId, userRole, id)
  }
}
