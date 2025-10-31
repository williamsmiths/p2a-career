import { Controller, Get, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common'
import { AdminService } from './admin.service'
import { ApproveJobDto, RejectJobDto } from './dto'
import { CurrentUser, Roles, UserRole } from '@common'

/**
 * Admin Controller
 * API cho Admin quản lý Jobs/Internships
 */
@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Lấy thống kê tổng quan
   */
  @Get('statistics')
  getStatistics() {
    return this.adminService.getStatistics()
  }

  /**
   * Lấy hàng đợi Internship chờ duyệt
   */
  @Get('internship-queue')
  getInternshipQueue(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.adminService.getInternshipQueue(page, limit)
  }

  /**
   * Lấy tất cả jobs chờ duyệt
   */
  @Get('pending-jobs')
  getPendingJobs(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.adminService.getPendingJobs(page, limit)
  }

  /**
   * Phê duyệt job
   */
  @Put('jobs/:id/approve')
  approveJob(@CurrentUser('id') adminId: string, @Param('id') jobId: string, @Body() approveJobDto: ApproveJobDto) {
    return this.adminService.approveJob(adminId, jobId, approveJobDto)
  }

  /**
   * Từ chối job
   */
  @Put('jobs/:id/reject')
  rejectJob(@CurrentUser('id') adminId: string, @Param('id') jobId: string, @Body() rejectJobDto: RejectJobDto) {
    return this.adminService.rejectJob(adminId, jobId, rejectJobDto)
  }
}
