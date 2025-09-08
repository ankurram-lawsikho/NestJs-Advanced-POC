# Database Setup Guide

## Option 1: Using Docker Compose (Recommended)

### 1. Start PostgreSQL with Docker Compose
```bash
docker-compose up -d postgres
```

### 2. Access PgAdmin (Optional)
```bash
# PgAdmin will be available at http://localhost:5050
# Email: admin@admin.com
# Password: admin
```

### 3. Start the NestJS Application
```bash
npm run start:dev
```

## Option 2: Local PostgreSQL Installation

### 1. Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- Or use package manager:
  ```bash
  # Windows (with Chocolatey)
  choco install postgresql
  
  # macOS (with Homebrew)
  brew install postgresql
  
  # Ubuntu/Debian
  sudo apt-get install postgresql postgresql-contrib
  ```

### 2. Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE nestjs_adv_poc;

-- Create user (optional)
CREATE USER nestjs_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE nestjs_adv_poc TO nestjs_user;
```

### 3. Update Environment Variables
Copy `env.example` to `.env` and update database credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=nestjs_adv_poc
```

## Database Features

### Auto-Seeding
The application automatically seeds the database with:
- **Admin User**: `admin@example.com` / `admin123`
- **Manager User**: `manager@example.com` / `manager123`

### TypeORM Features
- **Auto-synchronization**: Tables are created/updated automatically in development
- **Entity relationships**: Proper foreign key constraints
- **Migrations**: Ready for production migrations
- **Connection pooling**: Optimized database connections

### Security
- **Password hashing**: All passwords are hashed with bcrypt
- **SQL injection protection**: TypeORM provides parameterized queries
- **Connection security**: Environment-based configuration

## Troubleshooting

### Connection Issues
1. Check if PostgreSQL is running:
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Local
   sudo systemctl status postgresql
   ```

2. Verify connection:
   ```bash
   psql -h localhost -U postgres -d nestjs_adv_poc
   ```

### Port Conflicts
If port 5432 is already in use:
1. Change port in `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Use 5433 instead
   ```
2. Update `.env`:
   ```env
   DATABASE_PORT=5433
   ```

### Reset Database
```bash
# Stop containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d postgres
```
