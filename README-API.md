# P2A ASEAN Career Module - API Documentation

## 📋 Mô tả

Module Career là hệ thống tuyển dụng của P2A ASEAN Platform, cung cấp các chức năng:
- 🏢 Company Management - Quản lý hồ sơ công ty
- 💼 Job Posting - Đăng tin tuyển dụng
- 📝 CV Management - Quản lý CV ứng viên
- 📮 Job Applications - Quản lý hồ sơ ứng tuyển (Mini ATS)
- ⭐ Saved Jobs - Lưu công việc yêu thích

## 🏗️ Kiến trúc

### Công nghệ sử dụng
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 15 với TypeORM
- **Authentication**: JWT (Shared với Core System)
- **gRPC**: Giao tiếp với Core System
- **Documentation**: Swagger/OpenAPI

### Kết nối với Core System
Module Career sử dụng **gRPC** để giao tiếp với Core System để:
- Validate user authentication
- Lấy thông tin user
- Đồng bộ dữ liệu user

## 🚀 Cài đặt

### Prerequisites
- Node.js >= 20.x
- PostgreSQL >= 15
- P2A Core System đang chạy (với gRPC server)

### Bước 1: Cài đặt dependencies

```bash
cd p2a-career
yarn install
```

### Bước 2: Cấu hình Environment

Copy file `env.example.txt` thành `.env`:

```bash
cp env.example.txt .env
```

Cập nhật các biến môi trường:

```env
# Application
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=p2a_user
DB_PASSWORD=p2a_password
DB_DATABASE=p2a_career

# JWT (PHẢI GIỐNG VỚI CORE SYSTEM)
JWT_SECRET=your-super-secret-jwt-key-same-as-core

# gRPC - Core System Connection
GRPC_CORE_SYSTEM_URL=localhost:50051
```

### Bước 3: Chạy ứng dụng

**Development mode:**
```bash
yarn dev
```

**Production mode:**
```bash
yarn build
yarn start:prod
```

## 📚 API Documentation

Sau khi chạy ứng dụng ở development mode, truy cập Swagger UI tại:

```
http://localhost:3001/api/docs
```

## 🔑 Authentication

Module Career sử dụng JWT token từ Core System. Để sử dụng API:

1. **Đăng nhập tại Core System** để lấy `accessToken`
2. **Thêm token vào header** của mọi request (trừ public APIs)

```
Authorization: Bearer <accessToken>
```

## 📖 API Endpoints

### 1. Companies

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/companies` | Tạo hồ sơ công ty | ✅ | Company, Alumni, Startup |
| GET | `/api/companies/me` | Lấy hồ sơ công ty của tôi | ✅ | Company, Alumni, Startup |
| GET | `/api/companies` | Lấy danh sách công ty | ❌ | Public |
| GET | `/api/companies/:id` | Lấy chi tiết công ty | ❌ | Public |
| PUT | `/api/companies/:id` | Cập nhật công ty | ✅ | Owner/Admin |
| DELETE | `/api/companies/:id` | Xóa công ty | ✅ | Owner/Admin |

**Ví dụ: Tạo công ty**
```bash
POST /api/companies
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Tech Company Vietnam",
  "taxId": "0123456789",
  "companyType": "enterprise",
  "website": "https://techcompany.vn",
  "description": "Leading technology company",
  "contactEmail": "hr@techcompany.vn",
  "contactPhone": "0901234567",
  "workingDays": "Thứ 2 - Thứ 6",
  "overtimePolicy": "Trả theo giờ"
}
```

### 2. Jobs

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/jobs` | Tạo tin tuyển dụng | ✅ | Company, Alumni, Startup |
| GET | `/api/jobs/my-jobs` | Lấy tin của công ty tôi | ✅ | Company, Alumni, Startup |
| GET | `/api/jobs` | Lấy danh sách tin (filter) | ❌ | Public |
| GET | `/api/jobs/:id` | Lấy chi tiết tin | ❌ | Public |
| PUT | `/api/jobs/:id` | Cập nhật tin | ✅ | Owner/Admin |
| DELETE | `/api/jobs/:id` | Xóa tin | ✅ | Owner/Admin |

**Filter Parameters:**
- `keyword` - Từ khóa tìm kiếm
- `jobType` - Loại công việc (full-time, part-time, internship, contract)
- `status` - Trạng thái (pending, approved, rejected, closed)
- `cityId` - ID thành phố
- `isRemote` - Làm từ xa (true/false)
- `isUrgent` - Tuyển gấp (true/false)
- `companyId` - ID công ty
- `page` - Trang (default: 1)
- `limit` - Số lượng/trang (default: 10)

**Ví dụ: Tạo tin tuyển dụng**
```bash
POST /api/jobs
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Senior Full-Stack Developer",
  "description": "We are looking for...",
  "requirements": "- 5+ years of experience\n- Strong React, Node.js",
  "benefits": "- Competitive salary\n- 13th month salary",
  "salaryMin": 2000,
  "salaryMax": 3000,
  "jobType": "full-time",
  "deadline": "2025-12-31T23:59:59Z",
  "isRemote": true,
  "isUrgent": false
}
```

### 3. CVs

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/cvs` | Tạo CV | ✅ | Student, Alumni |
| GET | `/api/cvs/me` | Lấy danh sách CV của tôi | ✅ | Student, Alumni |
| GET | `/api/cvs/:id` | Lấy chi tiết CV | ✅ | All |
| PUT | `/api/cvs/:id` | Cập nhật CV | ✅ | Owner/Admin |
| DELETE | `/api/cvs/:id` | Xóa CV | ✅ | Owner/Admin |

**Ví dụ: Tạo CV**
```bash
POST /api/cvs
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Full-Stack Developer CV",
  "careerObjective": "Seeking a challenging position...",
  "isPublic": false,
  "experiences": [
    {
      "companyName": "ABC Tech",
      "position": "Senior Developer",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "description": "Developed web applications..."
    }
  ],
  "projects": [
    {
      "projectName": "E-commerce Platform",
      "description": "Built a full-stack platform",
      "projectUrl": "https://github.com/example",
      "startDate": "2022-01-01",
      "endDate": "2023-06-01"
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuedBy": "Amazon Web Services",
      "issueDate": "2023-01-01"
    }
  ]
}
```

### 4. Applications

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/applications` | Nộp hồ sơ ứng tuyển | ✅ | Student, Alumni |
| GET | `/api/applications/me` | Hồ sơ tôi đã nộp | ✅ | Student, Alumni |
| GET | `/api/applications/job/:jobId` | Ứng viên cho công việc | ✅ | Recruiter |
| GET | `/api/applications/:id` | Chi tiết hồ sơ | ✅ | All |
| PUT | `/api/applications/:id/status` | Cập nhật trạng thái | ✅ | Recruiter |
| DELETE | `/api/applications/:id` | Rút hồ sơ | ✅ | Candidate |

**Application Status Flow:**
1. `submitted` - Vừa nộp
2. `cv_viewed` - Đã xem CV
3. `cv_approved` - CV đạt yêu cầu
4. `interviewing` - Đang phỏng vấn
5. `offered` - Đã offer
6. `hired` - Đã tuyển
7. `rejected` - Từ chối

**Ví dụ: Nộp hồ sơ**
```bash
POST /api/applications
Content-Type: application/json
Authorization: Bearer <token>

{
  "jobId": "uuid-of-job",
  "cvId": "uuid-of-cv"
}
```

**Ví dụ: Cập nhật trạng thái (Recruiter)**
```bash
PUT /api/applications/:id/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "interviewing",
  "recruiterNotes": "Scheduled interview for next week"
}
```

### 5. Saved Jobs

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/saved-jobs/:jobId` | Lưu công việc | ✅ | Student, Alumni |
| GET | `/api/saved-jobs` | Danh sách đã lưu | ✅ | Student, Alumni |
| GET | `/api/saved-jobs/check/:jobId` | Kiểm tra đã lưu chưa | ✅ | Student, Alumni |
| DELETE | `/api/saved-jobs/:jobId` | Bỏ lưu công việc | ✅ | Student, Alumni |

## 📦 Postman Collection

Import file `postman-collection.json` vào Postman để test APIs.

### Sử dụng Postman Collection

1. **Import collection** vào Postman
2. **Set variables:**
   - `baseUrl`: `http://localhost:3001/api`
   - `accessToken`: Token từ Core System
3. **Test APIs** theo workflow

### Workflow ví dụ:

**Đối với Nhà tuyển dụng:**
1. Đăng nhập tại Core System (role: company)
2. Tạo hồ sơ công ty (`POST /companies`)
3. Tạo tin tuyển dụng (`POST /jobs`)
4. Xem danh sách ứng viên (`GET /applications/job/:jobId`)
5. Cập nhật trạng thái ứng viên (`PUT /applications/:id/status`)

**Đối với Ứng viên:**
1. Đăng nhập tại Core System (role: student/alumni)
2. Tạo CV (`POST /cvs`)
3. Tìm việc (`GET /jobs` với filter)
4. Lưu việc yêu thích (`POST /saved-jobs/:jobId`)
5. Nộp hồ sơ (`POST /applications`)
6. Theo dõi trạng thái (`GET /applications/me`)

## 🔧 Database Schema

### Entities

1. **companies** - Hồ sơ công ty
2. **jobs** - Tin tuyển dụng
3. **cvs** - CV ứng viên
4. **cv_experience** - Kinh nghiệm làm việc
5. **cv_projects** - Dự án đã tham gia
6. **cv_certifications** - Chứng chỉ
7. **job_applications** - Hồ sơ ứng tuyển
8. **saved_jobs** - Công việc đã lưu

## 🌍 gRPC Integration

Career Module kết nối với Core System qua gRPC để:

```typescript
// Validate user
const user = await grpcClientService.validateUser(userId);

// Get user info
const user = await grpcClientService.findUserById(userId);

// Get multiple users
const users = await grpcClientService.getUsersByIds(userIds);
```

## 🔒 Security

- ✅ JWT validation (shared secret với Core System)
- ✅ Role-based Access Control (RBAC)
- ✅ Owner-based permissions
- ✅ Input validation với class-validator
- ✅ SQL injection protection (TypeORM)

## 📝 Response Format

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2025-10-23T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "timestamp": "2025-10-23T10:30:00.000Z",
  "path": "/api/companies"
}
```

## 🤝 Contributing

Xem chi tiết trong file `README.md` chính.

---

**Developed by P2A ASEAN Team** 🎓

