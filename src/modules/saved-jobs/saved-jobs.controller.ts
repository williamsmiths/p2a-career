import { Controller, Get, Post, Delete, Param, Query, ParseIntPipe } from '@nestjs/common'
import { SavedJobsService } from './saved-jobs.service'
import { CurrentUser, Roles, UserRole } from '@common'

/**
 * Saved Jobs Controller
 * Quản lý công việc đã lưu
 */
@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post(':jobId')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  save(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.savedJobsService.save(userId, jobId)
  }

  @Get()
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  getMySavedJobs(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.savedJobsService.getMySavedJobs(userId, page, limit)
  }

  @Get('check/:jobId')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  isSaved(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.savedJobsService.isSaved(userId, jobId)
  }

  @Delete(':jobId')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  unsave(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.savedJobsService.unsave(userId, jobId)
  }
}
