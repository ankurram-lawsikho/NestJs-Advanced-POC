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
│   │   ├── users.controller.ts      # User endpoints
│   │   ├── users.service.ts         # User business logic
│   │   ├── users.service.spec.ts    # User service unit tests
│   │   └── users.module.ts          # User module configuration
│   ├── 📁 common/                   # Shared utilities
│   │   ├── 📁 decorators/           # Custom decorators
│   │   ├── 📁 filters/              # Exception filters
│   │   ├── 📁 guards/               # Custom guards
│   │   └── 📁 types/                # Type definitions
│   ├── app.controller.ts            # Root controller
│   ├── app.service.ts               # Root service
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Application entry point
├── 📁 test/                         # End-to-end tests
│   ├── app.e2e-spec.ts             # App E2E tests
│   ├── auth.e2e-spec.ts            # Auth E2E tests
│   ├── users.e2e-spec.ts           # Users E2E tests
│   └── jest-e2e.json               # E2E test configuration
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── nest-cli.json                    # NestJS CLI configuration
├── env.example                      # Environment variables template
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

---

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
  - Sets up global validation pipe
  - Configures global exception filter
  - Sets up Swagger documentation
  - Enables CORS
  - Starts server on port 3000

#### `src/app.module.ts`
- **Purpose**: Root module configuration
- **Key Features**:
  - Imports all feature modules
  - Configures global ConfigModule
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
  - `create()` - Creates new user
  - `findAll()` - Returns all users (without passwords)
  - `findById()` - Finds user by ID
  - `findByEmail()` - Finds user by email
  - `update()` - Updates user data
  - `remove()` - Deletes user
  - `activate()/deactivate()` - User status management
- **Features**: In-memory storage with mock data

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

---

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Copy environment file**: `cp env.example .env`
3. **Start development server**: `npm run start:dev`
4. **Run tests**: `npm test` (unit) or `npm run test:e2e` (E2E)
5. **Access Swagger docs**: http://localhost:3000/api

This project serves as a comprehensive example of advanced NestJS concepts and best practices for building secure, scalable applications with proper authentication, authorization, and testing.
