import { Controller, Get, Post, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavedJobsService } from './saved-jobs.service';
import { CurrentUser, Roles, UserRole } from '@common';

/**
 * Saved Jobs Controller
 * Quản lý công việc đã lưu
 */
@ApiTags('saved-jobs')
@ApiBearerAuth()
@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post(':jobId')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Lưu công việc' })
  save(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.savedJobsService.save(userId, jobId);
  }

  @Get()
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Lấy danh sách công việc đã lưu' })
  getMySavedJobs(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.savedJobsService.getMySavedJobs(userId, page, limit);
  }

  @Get('check/:jobId')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Kiểm tra đã lưu công việc chưa' })
  isSaved(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.savedJobsService.isSaved(userId, jobId);
  }

  @Delete(':jobId')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Bỏ lưu công việc' })
  unsave(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.savedJobsService.unsave(userId, jobId);
  }
}

