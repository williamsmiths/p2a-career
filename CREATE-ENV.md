# Tạo file .env cho P2A Career Module (Master/Slave Database)

## 🚨 Quan trọng: Tạo file .env

Bạn cần tạo file `.env` trong thư mục `p2a-career` với nội dung sau:

```bash
# Application
NODE_ENV=development
PORT=3001
APP_NAME=P2A Career Module
APP_URL=http://localhost:3001

# Database Master (for Docker)
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5434
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=p2a_password
DB_MASTER_DATABASE=p2a_career

# Database Slave (for Docker)
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

## 📋 Cách tạo:

### Windows (PowerShell/CMD):
```bash
cd p2a-career
echo # Application > .env
echo NODE_ENV=development >> .env
echo PORT=3001 >> .env
echo APP_NAME=P2A Career Module >> .env
echo APP_URL=http://localhost:3001 >> .env
echo. >> .env
echo # Database Master >> .env
echo DB_MASTER_HOST=localhost >> .env
echo DB_MASTER_PORT=5434 >> .env
echo DB_MASTER_USERNAME=p2a_user >> .env
echo DB_MASTER_PASSWORD=p2a_password >> .env
echo DB_MASTER_DATABASE=p2a_career >> .env
echo. >> .env
echo # Database Slave >> .env
echo DB_SLAVE_HOST=localhost >> .env
echo DB_SLAVE_PORT=5435 >> .env
echo DB_SLAVE_USERNAME=p2a_user >> .env
echo DB_SLAVE_PASSWORD=p2a_password >> .env
echo DB_SLAVE_DATABASE=p2a_career >> .env
echo. >> .env
echo # JWT >> .env
echo JWT_SECRET=your-super-secret-jwt-key-same-as-core >> .env
echo JWT_ACCESS_EXPIRATION=15m >> .env
echo JWT_REFRESH_EXPIRATION=7d >> .env
echo. >> .env
echo # gRPC >> .env
echo GRPC_CORE_SYSTEM_URL=localhost:50051 >> .env
echo. >> .env
echo # CORS >> .env
echo CORS_ORIGIN=http://localhost:3000,http://localhost:3001 >> .env
echo. >> .env
echo # Rate Limiting >> .env
echo THROTTLE_TTL=60 >> .env
echo THROTTLE_LIMIT=100 >> .env
echo. >> .env
echo # Timezone >> .env
echo TZ=UTC >> .env
```

### Linux/Mac:
```bash
cd p2a-career
cat > .env << 'EOF'
# Application
NODE_ENV=development
PORT=3001
APP_NAME=P2A Career Module
APP_URL=http://localhost:3001

# Database Master (for Docker)
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5434
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=p2a_password
DB_MASTER_DATABASE=p2a_career

# Database Slave (for Docker)
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
EOF
```

## ⚠️ Lưu ý quan trọng:

1. **JWT_SECRET phải giống với Core System** - nếu khác sẽ không validate được token
2. **Master/Slave Database phải chạy** - sử dụng Docker Compose để start
3. **Core System phải chạy trước** - để gRPC connection hoạt động

## 🐳 Chạy Master/Slave Database:

```bash
# Start Master/Slave Database
docker-compose -f docker-compose-db.yml up -d

# Kiểm tra containers
docker ps
```

## 🔧 Sau khi tạo .env:

```bash
# Chạy Career Module
yarn dev
```

Nếu vẫn lỗi, kiểm tra:
- File `.env` có đúng format không
- Master/Slave Database có đang chạy không
- Core System có đang chạy không