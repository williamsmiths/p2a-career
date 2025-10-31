# Hướng Dẫn Các Tính Năng Mới - P2A Career

## 📋 Tổng Quan

Document này mô tả các tính năng mới được thêm vào P2A Career để hoàn thiện Epic 2: Career (Employee).

## ✨ Các Tính Năng Đã Thêm

### 1. 🎓 Internship-Specific Fields

Các trường mới trong bảng `jobs` dành riêng cho Internship:

- `duration_months`: Thời gian thực tập (tháng)
- `allowance_min` / `allowance_max`: Mức trợ cấp thực tập
- `mentorship_available`: Có hỗ trợ mentor không
- `learning_objectives`: Mục tiêu học tập

**Ví dụ tạo tin Internship:**

```json
POST /jobs
{
  "title": "Software Engineering Intern",
  "description": "Join our team as an intern...",
  "requirements": "Students in Computer Science...",
  "benefits": "Mentorship, real projects...",
  "jobType": "internship",
  "durationMonths": 6,
  "allowanceMin": 500,
  "allowanceMax": 800,
  "mentorshipAvailable": true,
  "learningObjectives": "Learn full-stack development..."
}
```

### 2. 👨‍💼 Admin Workflow - Approve/Reject Jobs

Module Admin mới với các API:

#### **GET /admin/statistics**

Xem thống kê tổng quan

```json
{
  "statistics": {
    "totalPending": 15,
    "totalApproved": 125,
    "totalRejected": 8,
    "totalInternshipPending": 5
  }
}
```

#### **GET /admin/internship-queue**

Xem hàng đợi Internship chờ duyệt (PENDING)

```
Query params: page, limit
```

#### **GET /admin/pending-jobs**

Xem tất cả jobs chờ duyệt (bao gồm cả job và internship)

#### **PUT /admin/jobs/:id/approve**

Phê duyệt một tin tuyển dụng

```json
{
  "note": "Approved - Good internship program"
}
```

#### **PUT /admin/jobs/:id/reject**

Từ chối tin tuyển dụng

```json
{
  "rejectionReason": "Description is not detailed enough"
}
```

**Quyền truy cập:** Chỉ có `UserRole.ADMIN`

### 3. 🔔 Priority Notification for Alumni

Các trường mới cho tính năng thông báo ưu tiên:

- `notify_alumni`: Gửi thông báo cho cựu sinh viên
- `prioritize_university_id`: ID trường đại học được ưu tiên

**Ví dụ tạo job với priority notification:**

```json
POST /jobs
{
  "title": "Senior Developer",
  "description": "...",
  "jobType": "full-time",
  "notifyAlumni": true,
  "prioritizeUniversityId": "uuid-of-university"
}
```

**Flow hoạt động:**

1. Doanh nghiệp tạo tin tuyển dụng với `notifyAlumni: true`
2. Admin approve tin đăng
3. Hệ thống tự động gửi thông báo đến:
   - Alumni (nếu `notifyAlumni = true`)
   - Students/Alumni của trường cụ thể (nếu có `prioritizeUniversityId`)

### 4. 🌍 Filter by Industry & Country

Bổ sung filter mới trong API `GET /jobs`:

- `industryId`: Lọc theo ngành nghề
- `countryId`: Lọc theo quốc gia (ASEAN countries)

**Ví dụ:**

```
GET /jobs?jobType=internship&countryId=1&industryId=5&page=1&limit=10
```

**Các filter khả dụng:**

- `keyword`: Tìm theo title, description
- `jobType`: full-time, part-time, internship, contract
- `status`: pending, approved, rejected, closed
- `cityId`: Lọc theo thành phố
- `industryId`: Lọc theo ngành nghề ⭐ **MỚI**
- `countryId`: Lọc theo quốc gia ⭐ **MỚI**
- `isRemote`: Remote work
- `isUrgent`: Tuyển gấp
- `companyId`: Công ty cụ thể

## 🗄️ Database Migration

Chạy migration để thêm các cột mới:

```bash
# Kết nối database và chạy:
psql -U postgres -d p2a_career < migrations/001_add_internship_and_priority_fields.sql
```

Hoặc chạy trực tiếp trong PostgreSQL:

```sql
\i migrations/001_add_internship_and_priority_fields.sql
```

## 🔧 Notification System (TODO)

Module `notifications` đã được tạo sẵn với các phương thức:

- `notifyJobApproved()`: Thông báo job được approve
- `notifyJobRejected()`: Thông báo job bị reject
- `notifyAlumni()`: Gửi thông báo đến alumni
- `notifyUniversity()`: Gửi thông báo đến trường cụ thể

**Cần thực hiện:**

- [ ] Tích hợp email service (SendGrid, AWS SES, etc.)
- [ ] Tích hợp push notification (Firebase, OneSignal, etc.)
- [ ] Tạo in-app notification table
- [ ] Query alumni/students từ Core System qua gRPC
- [ ] Implement notification preferences

## 📊 Job Status Flow

```
PENDING (default)
    ↓
    ├─→ APPROVED (by Admin) → Public & Send notifications
    ├─→ REJECTED (by Admin) → Send rejection reason
    └─→ CLOSED (by Company) → No longer accepting applications
```

## 🔐 Permissions

| Endpoint                      | Roles                                 |
| ----------------------------- | ------------------------------------- |
| `POST /jobs`                  | COMPANY, ALUMNI, STARTUP              |
| `PUT /jobs/:id`               | COMPANY, ALUMNI, STARTUP (owner only) |
| `GET /admin/*`                | ADMIN only                            |
| `PUT /admin/jobs/:id/approve` | ADMIN only                            |
| `PUT /admin/jobs/:id/reject`  | ADMIN only                            |

## 🧪 Testing

### Test Admin Workflow

1. **Tạo Internship (as Company):**

```bash
curl -X POST http://localhost:3002/jobs \
  -H "Authorization: Bearer <company_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineering Intern",
    "jobType": "internship",
    "durationMonths": 6,
    "notifyAlumni": true
  }'
```

2. **Xem Queue (as Admin):**

```bash
curl -X GET http://localhost:3002/admin/internship-queue \
  -H "Authorization: Bearer <admin_token>"
```

3. **Approve (as Admin):**

```bash
curl -X PUT http://localhost:3002/admin/jobs/<job_id>/approve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"note": "Approved"}'
```

## 📝 Notes

- Tất cả jobs mới sẽ có `status = PENDING` mặc định
- Admin cần approve trước khi job hiển thị công khai
- Notification system hiện chỉ có logging, cần implement email/push
- GrpcClient có thể dùng để query users từ Core System

## 🚀 Next Steps

1. Implement email/push notification service
2. Tạo UI cho Admin dashboard
3. Thêm analytics cho internship programs
4. Implement notification preferences cho users
5. Thêm bulk approve/reject actions
6. Create automated tests

## 📞 Support

Nếu có vấn đề, liên hệ team development.
