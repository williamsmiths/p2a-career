# P2A Career Module - Docker Setup (Master/Slave)

## 🐳 Chạy Career Module với Master/Slave Database

### 1. Khởi động Master/Slave Database

```bash
cd p2a-career
docker-compose -f docker-compose-db.yml up -d
```

### 2. Kiểm tra Database

```bash
# Kiểm tra containers
docker ps

# Kiểm tra logs
docker logs p2a-career-postgres-master
docker logs p2a-career-postgres-slave
```

### 3. Truy cập PgAdmin

- URL: http://localhost:5051
- Email: admin@p2a-career.com
- Password: admin123

**Thêm servers trong PgAdmin:**

**Master Server:**
- Host: postgres-career-master
- Port: 5432
- Database: p2a_career
- Username: p2a_user
- Password: p2a_password

**Slave Server:**
- Host: postgres-career-slave
- Port: 5432
- Database: p2a_career
- Username: p2a_user
- Password: p2a_password

### 4. Cấu hình Environment

Tạo file `.env`:

```env
# Application
NODE_ENV=development
PORT=3001
APP_NAME=P2A Career Module
APP_URL=http://localhost:3001

# Database Master (Docker)
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5434
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=p2a_password
DB_MASTER_DATABASE=p2a_career

# Database Slave (Docker)
DB_SLAVE_HOST=localhost
DB_SLAVE_PORT=5435
DB_SLAVE_USERNAME=p2a_user
DB_SLAVE_PASSWORD=p2a_password
DB_SLAVE_DATABASE=p2a_career

# JWT (PHẢI GIỐNG VỚI CORE SYSTEM)
JWT_SECRET=your-super-secret-jwt-key-same-as-core
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# gRPC - Core System Connection
GRPC_CORE_SYSTEM_URL=localhost:50051

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Timezone (Always UTC)
TZ=UTC
```

### 5. Chạy Career Module

```bash
# Cài đặt dependencies
yarn install

# Chạy development
yarn dev
```

## 📋 Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| PostgreSQL | p2a-career-postgres | 5434 | Database cho Career Module |
| PgAdmin | p2a-career-pgadmin | 5051 | Database management UI |

## 🔧 Commands

### Start services:
```bash
docker-compose -f docker-compose-db.yml up -d
```

### Stop services:
```bash
docker-compose -f docker-compose-db.yml down
```

### View logs:
```bash
docker logs p2a-career-postgres-master
docker logs p2a-career-postgres-slave
docker logs p2a-career-pgadmin
```

### Reset database:
```bash
docker-compose -f docker-compose-db.yml down -v
docker-compose -f docker-compose-db.yml up -d
```

## 🗄️ Database Schema

Database sẽ được khởi tạo tự động với:

### Tables:
- `companies` - Hồ sơ công ty
- `jobs` - Tin tuyển dụng
- `cvs` - CV ứng viên
- `cv_experience` - Kinh nghiệm làm việc
- `cv_projects` - Dự án
- `cv_certifications` - Chứng chỉ
- `job_applications` - Hồ sơ ứng tuyển
- `saved_jobs` - Công việc đã lưu

### Enums:
- `company_type` - Loại hình công ty
- `verification_status` - Trạng thái xác thực
- `job_status` - Trạng thái tin tuyển dụng
- `job_type` - Loại hình công việc
- `application_status` - Trạng thái ứng tuyển

## 🚀 Full Setup Workflow

### 1. Start Core System Database:
```bash
cd p2a-core-system
docker-compose -f docker-compose-db.yml up -d
```

### 2. Start Core System:
```bash
cd p2a-core-system
yarn dev
```

### 3. Start Career Database:
```bash
cd p2a-career
docker-compose -f docker-compose-db.yml up -d
```

### 4. Start Career Module:
```bash
cd p2a-career
yarn dev
```

### 5. Test APIs:
- Core System: http://localhost:3000/api/docs
- Career Module: http://localhost:3001/api/docs
- PgAdmin: http://localhost:5051

## 🔍 Troubleshooting

### Database connection failed:
- Kiểm tra container có chạy không: `docker ps`
- Kiểm tra port 5434, 5435 có bị conflict không
- Kiểm tra logs: `docker logs p2a-career-postgres-master`
- Kiểm tra logs: `docker logs p2a-career-postgres-slave`

### gRPC connection failed:
- Đảm bảo Core System đang chạy
- Kiểm tra port 50051

### JWT validation failed:
- Đảm bảo JWT_SECRET giống nhau giữa 2 modules
