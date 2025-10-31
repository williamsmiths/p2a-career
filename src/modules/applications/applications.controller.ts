import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { ApplicationsService } from './applications.service'
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto'
import { CurrentUser, Roles, UserRole } from '@common'

/**
 * Applications Controller
 * Quản lý hồ sơ ứng tuyển
 */
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  create(@CurrentUser('id') userId: string, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(userId, createApplicationDto)
  }

  @Get('me')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  getMyApplications(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.applicationsService.getMyApplications(userId, page, limit)
  }

  @Get('job/:jobId')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  getApplicationsForJob(
    @CurrentUser('id') userId: string,
    @Param('jobId') jobId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.applicationsService.getApplicationsForJob(userId, jobId, page, limit)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.applicationsService.findById(id)
  }

  @Put(':id/status')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto
  ) {
    return this.applicationsService.updateStatus(userId, id, updateApplicationStatusDto)
  }

  @Delete(':id')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  withdraw(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.applicationsService.withdraw(userId, id)
  }
}
