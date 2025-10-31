import { Injectable, Logger } from '@nestjs/common'

/**
 * Notifications Service
 * Xử lý logic gửi thông báo
 * TODO: Tích hợp với hệ thống notification thực tế (email, push notification, etc.)
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  /**
   * Gửi thông báo khi job được approve
   */
  async notifyJobApproved(job: any) {
    this.logger.log(`Notifying company ${job.companyId} that job ${job.id} was approved`)

    // TODO: Implement actual notification logic
    // - Send email to company
    // - Create in-app notification
    // - Send push notification if mobile app exists

    return { sent: true }
  }

  /**
   * Gửi thông báo khi job bị reject
   */
  async notifyJobRejected(job: any, reason: string) {
    this.logger.log(`Notifying company ${job.companyId} that job ${job.id} was rejected`)

    // TODO: Implement actual notification logic

    return { sent: true }
  }

  /**
   * Gửi thông báo ưu tiên đến alumni
   */
  async notifyAlumni(job: any) {
    if (!job.notifyAlumni) {
      return { sent: false, reason: 'notifyAlumni is false' }
    }

    this.logger.log(`Sending priority notification to alumni for job ${job.id}`)

    // TODO: Query alumni from university system via gRPC
    // TODO: Send notifications to all alumni
    // TODO: Consider filtering by graduation year, major, etc.

    return { sent: true }
  }

  /**
   * Gửi thông báo ưu tiên đến một trường đại học cụ thể
   */
  async notifyUniversity(job: any) {
    if (!job.prioritizeUniversityId) {
      return { sent: false, reason: 'No university to prioritize' }
    }

    this.logger.log(`Sending priority notification to university ${job.prioritizeUniversityId} for job ${job.id}`)

    // TODO: Query students/alumni from specific university via gRPC
    // TODO: Send priority notifications
    // TODO: May include special badge or highlight in UI

    return { sent: true }
  }

  /**
   * Gửi thông báo cho tất cả các bên liên quan khi job được approve
   */
  async sendAllNotificationsOnApproval(job: any) {
    const results = await Promise.allSettled([
      this.notifyJobApproved(job),
      this.notifyAlumni(job),
      this.notifyUniversity(job)
    ])

    this.logger.log(`All notifications sent for job ${job.id}`, results)

    return { results }
  }
}
