# P2A Career Module - Quick Setup Guide

## 🚀 Setup nhanh

### 1. Cài đặt dependencies

```bash
cd p2a-career
yarn install
```

### 2. Cấu hình environment

```bash
cp env.example.txt .env
```

Sửa file `.env`:
```env
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

### 3. Chạy Core System trước

```bash
cd ../p2a-core-system
yarn install
yarn dev
```

Core System sẽ chạy trên:
- HTTP: http://localhost:3000
- gRPC: localhost:50051

### 4. Chạy Career Module

```bash
cd p2a-career
yarn dev
```

Career Module sẽ chạy trên:
- HTTP: http://localhost:3001

### 5. Test APIs

1. **Import Postman Collection:**
   - File: `postman-collection.json`
   - Set variables: `baseUrl`, `accessToken`

2. **Đăng nhập để lấy token:**
   - POST http://localhost:3000/api/auth/login
   - Copy `accessToken` từ response

3. **Test Career APIs:**
   - Set `accessToken` trong Postman
   - Test các endpoints theo workflow

## 📋 Workflow Test

### Nhà tuyển dụng:
1. Đăng nhập (role: company)
2. Tạo hồ sơ công ty
3. Tạo tin tuyển dụng
4. Xem danh sách ứng viên

### Ứng viên:
1. Đăng nhập (role: student/alumni)
2. Tạo CV
3. Tìm việc và lưu việc yêu thích
4. Nộp hồ sơ ứng tuyển

## 🔧 Troubleshooting

### Lỗi gRPC connection:
- Đảm bảo Core System đang chạy
- Kiểm tra port 50051 không bị conflict

### Lỗi JWT:
- Đảm bảo `JWT_SECRET` giống nhau giữa 2 modules

### Lỗi database:
- Đảm bảo PostgreSQL đang chạy
- Kiểm tra connection string

## 📖 Documentation

- API Docs: http://localhost:3001/api/docs
- Postman Collection: `postman-collection.json`
- Chi tiết: `README-API.md`
