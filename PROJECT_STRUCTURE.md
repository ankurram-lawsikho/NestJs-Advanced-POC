# NestJS Advanced POC - Project Structure & File Documentation

## 📁 Project Overview
This is a comprehensive NestJS application demonstrating advanced concepts including custom decorators, guards, exception filters, and testing best practices. The project implements a **User Management System with Role-Based Access Control (RBAC)**.

## 🏗️ Folder Structure

```
nestjs-adv-poc/
├── 📁 src/                          # Source code directory
│   ├── 📁 auth/                     # Authentication module
│   │   ├── 📁 dto/                  # Data Transfer Objects
│   │   ├── 📁 guards/               # Authentication guards
│   │   ├── 📁 strategies/           # Passport strategies
│   │   ├── auth.controller.ts       # Auth endpoints
│   │   ├── auth.service.ts          # Auth business logic
│   │   ├── auth.service.spec.ts     # Auth service unit tests
│   │   └── auth.module.ts           # Auth module configuration
│   ├── 📁 users/                    # Users module
│   │   ├── 📁 dto/                  # User DTOs
│   │   ├── 📁 entities/             # TypeORM entities
│   │   ├── users.controller.ts      # User endpoints
│   │   ├── users.service.ts         # User business logic
│   │   ├── users.service.spec.ts    # User service unit tests
│   │   └── users.module.ts          # User module configuration
│   ├── 📁 database/                 # Database configuration
│   │   ├── database.module.ts       # TypeORM configuration
│   │   └── seed.service.ts          # Database seeding service
│   ├── 📁 security/                 # Security configuration
│   │   └── security.config.ts       # Helmet and CORS settings
│   ├── 📁 common/                   # Shared utilities
│   │   ├── 📁 decorators/           # Custom decorators
│   │   ├── 📁 filters/              # Exception filters
│   │   ├── 📁 guards/               # Custom guards
│   │   ├── 📁 middleware/           # Security and rate limiting middleware
│   │   └── 📁 types/                # Type definitions
│   ├── app.controller.ts            # Root controller
│   ├── app.service.ts               # Root service
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Application entry point
├── 📁 test/                         # End-to-end tests and scripts
│   ├── 📁 scripts/                  # Database setup and reset scripts
│   │   ├── setup-test-db.js         # Test database setup
│   │   ├── reset-test-db.js         # Test database reset
│   │   └── setup-db.md              # Database setup documentation
│   ├── app.e2e-spec.ts             # App E2E tests
│   ├── auth.e2e-spec.ts            # Auth E2E tests
│   ├── users.e2e-spec.ts           # Users E2E tests
│   ├── test-app.module.ts          # Test application module
│   ├── test-database.module.ts     # Test database configuration
│   └── jest-e2e.json               # E2E test configuration
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── nest-cli.json                    # NestJS CLI configuration
├── env.example                      # Environment variables template
├── .gitignore                       # Git ignore rules
├── SECURITY.md                      # Security documentation
└── README.md                        # Project documentation
```

---

Permission Heirarchy by Role

ADMIN (All Permissions)
├── read:users ✅
├── write:users ✅
├── delete:users ✅
├── read:profile ✅
├── write:profile ✅
└── manage:system ✅

MANAGER (User Management)
├── read:users ✅
├── write:users ✅
├── delete:users ❌
├── read:profile ✅
├── write:profile ✅
└── manage:system ❌

USER (Self Management)
├── read:users ❌
├── write:users ❌
├── delete:users ❌
├── read:profile ✅
├── write:profile ✅
└── manage:system ❌

GUEST (No Access)
├── read:users ❌
├── write:users ❌
├── delete:users ❌
├── read:profile ❌
├── write:profile ❌
└── manage:system ❌

## 📄 File Documentation

### 🔧 Configuration Files

#### `package.json`
- **Purpose**: Project dependencies, scripts, and metadata
- **Key Features**:
  - NestJS framework dependencies
  - JWT authentication packages
  - Testing frameworks (Jest, Supertest)
  - Swagger documentation
  - Development tools (ESLint, Prettier)
- **Scripts**: `start:dev`, `test`, `test:e2e`, `build`, `lint`

#### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Key Features**:
  - Enables decorators and metadata
  - ES2020 target
  - Path mapping for imports
  - Source maps for debugging

#### `nest-cli.json`
- **Purpose**: NestJS CLI configuration
- **Key Features**:
  - Source root directory
  - Build output settings
  - Schema collection

#### `env.example`
- **Purpose**: Environment variables template
- **Variables**:
  - JWT secret and expiration
  - Application port and environment
  - Database configuration (commented)
  - Logging level

---

### 🚀 Application Entry Point

#### `src/main.ts`
- **Purpose**: Application bootstrap and configuration
- **Key Features**:
  - Creates NestJS application
  - Sets up Helmet.js security middleware
  - Configures global validation pipe
  - Configures global exception filter
  - Sets up Swagger documentation at `/api-docs`
  - Enables CORS with security settings
  - Starts server on port 3000

#### `src/app.module.ts`
- **Purpose**: Root module configuration
- **Key Features**:
  - Imports all feature modules (Database, Auth, Users)
  - Configures global ConfigModule
  - Applies security and rate limiting middleware
  - Exports root controller and service

#### `src/app.controller.ts`
- **Purpose**: Root application endpoints
- **Endpoints**:
  - `GET /` - Welcome message
  - `GET /health` - Health check with uptime
- **Features**: Swagger documentation

#### `src/app.service.ts`
- **Purpose**: Root application service
- **Methods**: `getHello()` - Returns welcome message

---

### 🗄️ Database Module (`src/database/`)

#### `database.module.ts`
- **Purpose**: TypeORM database configuration
- **Key Features**:
  - PostgreSQL database connection
  - Entity registration (UserEntity)
  - Database synchronization
  - Environment-based configuration

#### `seed.service.ts`
- **Purpose**: Database seeding service
- **Key Features**:
  - Creates initial admin user
  - Seeds default data on application startup
  - Handles database initialization

---

### 🔒 Security Module (`src/security/`)

#### `security.config.ts`
- **Purpose**: Centralized security configuration
- **Key Features**:
  - Helmet.js security headers configuration
  - CORS settings with environment awareness
  - Content Security Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - XSS and clickjacking protection

---

### 🛡️ Security Middleware (`src/common/middleware/`)

#### `security.middleware.ts`
- **Purpose**: Additional security headers middleware
- **Key Features**:
  - Sets security headers (X-Frame-Options, X-Content-Type-Options)
  - Configures cache control
  - Removes X-Powered-By header

#### `rate-limit.middleware.ts`
- **Purpose**: Rate limiting middleware
- **Key Features**:
  - General rate limiting (100 requests/15min)
  - Authentication rate limiting (5 requests/15min)
  - IP-based request throttling

---

### 🔐 Authentication Module (`src/auth/`)

#### `auth.module.ts`
- **Purpose**: Authentication module configuration
- **Key Features**:
  - Imports JWT and Passport modules
  - Configures JWT with async factory
  - Exports AuthService for other modules

#### `auth.service.ts`
- **Purpose**: Authentication business logic
- **Key Methods**:
  - `validateUser()` - Validates user credentials
  - `login()` - Generates JWT token
  - `register()` - Creates new user with hashed password
  - `getDefaultPermissions()` - Assigns permissions based on role
- **Features**: Password hashing with bcrypt

#### `auth.controller.ts`
- **Purpose**: Authentication endpoints
- **Endpoints**:
  - `POST /auth/register` - User registration (public)
  - `POST /auth/login` - User login (public)
  - `POST /auth/refresh` - Token refresh (protected)
- **Features**: Uses custom `@Public()` decorator

#### `auth.service.spec.ts`
- **Purpose**: Unit tests for AuthService
- **Test Coverage**:
  - User validation with valid/invalid credentials
  - JWT token generation
  - User registration with role-based permissions
  - Mocked dependencies (UsersService, JwtService, bcrypt)

### 📁 Auth DTOs (`src/auth/dto/`)

#### `login.dto.ts`
- **Purpose**: Login request validation
- **Fields**: email (validated), password (min 6 chars)
- **Features**: Swagger documentation

#### `register.dto.ts`
- **Purpose**: Registration request validation
- **Fields**: email, username (min 3 chars), password (min 6 chars), role (optional)
- **Features**: Enum validation for UserRole

### 🛡️ Auth Guards (`src/auth/guards/`)

#### `local-auth.guard.ts`
- **Purpose**: Local authentication guard
- **Features**: Extends Passport's AuthGuard for local strategy

### 🎯 Auth Strategies (`src/auth/strategies/`)

#### `jwt.strategy.ts`
- **Purpose**: JWT authentication strategy
- **Key Features**:
  - Extracts JWT from Authorization header
  - Validates token and user existence
  - Returns user object for request context

#### `local.strategy.ts`
- **Purpose**: Local authentication strategy
- **Key Features**:
  - Uses email as username field
  - Validates credentials via AuthService
  - Throws UnauthorizedException for invalid credentials

---

### 👥 Users Module (`src/users/`)

#### `users.module.ts`
- **Purpose**: Users module configuration
- **Key Features**: Exports UsersService for other modules

#### `users.service.ts`
- **Purpose**: User management business logic
- **Key Methods**:
  - `create()` - Creates new user with password hashing
  - `findAll()` - Returns all users (without passwords)
  - `findById()` - Finds user by ID
  - `findByEmail()` - Finds user by email
  - `update()` - Updates user data
  - `remove()` - Deletes user
  - `activate()/deactivate()` - User status management
- **Features**: TypeORM integration with PostgreSQL database

#### `users.controller.ts`
- **Purpose**: User management endpoints
- **Endpoints**:
  - `GET /users` - Get all users (Admin/Manager)
  - `GET /users/profile` - Get current user profile
  - `GET /users/:id` - Get user by ID (Admin/Manager)
  - `POST /users` - Create user (Admin)
  - `PATCH /users/profile` - Update own profile
  - `PATCH /users/:id` - Update user (Admin)
  - `DELETE /users/:id` - Delete user (Admin)
  - `PATCH /users/:id/activate` - Activate user (Admin/Manager)
  - `PATCH /users/:id/deactivate` - Deactivate user (Admin/Manager)
- **Features**: Uses multiple guards and decorators for access control

#### `users.service.spec.ts`
- **Purpose**: Unit tests for UsersService
- **Test Coverage**:
  - User creation and validation
  - CRUD operations
  - Error handling (NotFoundException, ConflictException)
  - Password exclusion from responses

### 📁 User DTOs (`src/users/dto/`)

#### `create-user.dto.ts`
- **Purpose**: User creation validation
- **Fields**: email, username, password, role, permissions (optional)
- **Features**: Enum validation for UserRole and Permission

#### `update-user.dto.ts`
- **Purpose**: User update validation
- **Features**: Extends CreateUserDto but excludes password field

---

### 🔧 Common Utilities (`src/common/`)

### 📁 Types (`src/common/types/`)

#### `user.types.ts`
- **Purpose**: Type definitions and enums
- **Key Types**:
  - `UserRole` enum (ADMIN, MANAGER, USER, GUEST)
  - `Permission` enum (granular permissions)
  - `User` interface
  - `JwtPayload` interface
  - `RequestWithUser` interface

### 📁 Decorators (`src/common/decorators/`)

#### `current-user.decorator.ts`
- **Purpose**: Custom decorator to extract current user
- **Features**: Can extract specific user properties or entire user object

#### `roles.decorator.ts`
- **Purpose**: Custom decorator for role-based access control
- **Features**: Works with RolesGuard to enforce role requirements

#### `permissions.decorator.ts`
- **Purpose**: Custom decorator for permission-based access control
- **Features**: Works with PermissionsGuard to enforce permission requirements

#### `public.decorator.ts`
- **Purpose**: Custom decorator to mark routes as public
- **Features**: Bypasses JWT authentication when applied

### 📁 Guards (`src/common/guards/`)

#### `jwt-auth.guard.ts`
- **Purpose**: JWT authentication guard with public route support
- **Features**: Checks for `@Public()` decorator before enforcing authentication

#### `roles.guard.ts`
- **Purpose**: Role-based access control guard
- **Features**: Validates user roles against required roles from `@Roles()` decorator

#### `permissions.guard.ts`
- **Purpose**: Permission-based access control guard
- **Features**: Validates user permissions against required permissions from `@RequirePermissions()` decorator

#### `roles.guard.spec.ts`
- **Purpose**: Unit tests for RolesGuard
- **Test Coverage**: Role validation, error handling, public route bypass

#### `permissions.guard.spec.ts`
- **Purpose**: Unit tests for PermissionsGuard
- **Test Coverage**: Permission validation, missing permissions handling

### 📁 Filters (`src/common/filters/`)

#### `global-exception.filter.ts`
- **Purpose**: Global exception handling
- **Key Features**:
  - Catches all exceptions
  - Returns structured error responses
  - Logs errors with context
  - Includes stack traces in development

#### `validation-exception.filter.ts`
- **Purpose**: Custom validation error formatting
- **Key Features**:
  - Formats validation errors with field information
  - Provides detailed error messages
  - Extracts field names from error messages

---

### 🧪 Testing (`test/`)

#### `jest-e2e.json`
- **Purpose**: End-to-end test configuration
- **Features**: Jest configuration for E2E tests

#### `test-app.module.ts`
- **Purpose**: Test application module configuration
- **Features**: Imports TestDatabaseModule for E2E tests

#### `test-database.module.ts`
- **Purpose**: Test database configuration
- **Features**: 
  - Separate test database connection
  - Schema synchronization for tests
  - Test-specific TypeORM configuration

### 📁 Test Scripts (`test/scripts/`)

#### `setup-test-db.js`
- **Purpose**: Test database setup script
- **Features**: Creates test database if it doesn't exist

#### `reset-test-db.js`
- **Purpose**: Test database reset script
- **Features**: Drops and recreates test database for clean test runs

#### `setup-db.md`
- **Purpose**: Database setup documentation
- **Features**: Instructions for setting up PostgreSQL database

#### `app.e2e-spec.ts`
- **Purpose**: Basic application E2E tests
- **Test Coverage**:
  - Root endpoint functionality
  - Health check endpoint

#### `auth.e2e-spec.ts`
- **Purpose**: Authentication E2E tests
- **Test Coverage**:
  - User registration with validation
  - User login with valid/invalid credentials
  - Token refresh functionality
  - Error handling scenarios

#### `users.e2e-spec.ts`
- **Purpose**: User management E2E tests
- **Test Coverage**:
  - Role-based access control
  - Permission-based access control
  - CRUD operations with different user roles
  - Protected route access validation

---

## 🔑 Key Features Demonstrated

### 1. **Custom Decorators**
- `@CurrentUser()` - Extracts user from request
- `@Roles()` - Specifies required roles
- `@RequirePermissions()` - Specifies required permissions
- `@Public()` - Marks routes as public

### 2. **Advanced Guards**
- JWT authentication with public route support
- Role-based access control
- Permission-based access control

### 3. **Exception Filters**
- Global exception handling
- Custom validation error formatting
- Structured error responses

### 4. **Comprehensive Testing**
- Unit tests with mocks
- End-to-end tests with authentication
- Role and permission testing

### 5. **Security Features**
- JWT token authentication
- Password hashing with bcrypt
- Role-based and permission-based authorization
- Input validation and sanitization
- Helmet.js security headers
- Rate limiting and throttling
- CORS protection
- Content Security Policy (CSP)
- XSS and clickjacking protection

---

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Copy environment file**: `cp env.example .env`
3. **Setup database**: Follow instructions in `test/scripts/setup-db.md`
4. **Start development server**: `npm run start:dev`
5. **Run tests**: 
   - Unit tests: `npm test`
   - E2E tests: `npm run test:e2e`
   - Individual E2E tests: `npm run test:e2e:app`, `npm run test:e2e:auth`, `npm run test:e2e:users`
6. **Access Swagger docs**: http://localhost:3000/api-docs
7. **Database scripts**:
   - Setup test database: `npm run test:db:setup`
   - Reset test database: `npm run test:db:reset`

## 📚 Additional Documentation

- **Security Features**: See `SECURITY.md` for detailed security implementation
- **Database Setup**: See `test/scripts/setup-db.md` for PostgreSQL configuration
- **API Documentation**: Available at http://localhost:3000/api-docs when running

This project serves as a comprehensive example of advanced NestJS concepts and best practices for building secure, scalable applications with proper authentication, authorization, testing, and security features.
