# NestJS Advanced POC

A comprehensive demonstration of advanced NestJS concepts including custom decorators, guards, exception filters, and testing best practices.

## 🚀 Features Demonstrated

### 1. Custom Decorators
- **`@CurrentUser()`** - Extracts current user from request context
- **`@Roles()`** - Specifies required roles for route access
- **`@RequirePermissions()`** - Specifies required permissions for route access
- **`@Public()`** - Marks routes as public (no authentication required)

### 2. Advanced Guards
- **`JwtAuthGuard`** - JWT authentication with public route support
- **`RolesGuard`** - Role-based access control
- **`PermissionsGuard`** - Permission-based access control

### 3. Exception Filters
- **`GlobalExceptionFilter`** - Global error handling with structured responses
- **`ValidationExceptionFilter`** - Custom validation error formatting

### 4. Testing
- **End-to-End Tests** - Complete API testing with authentication scenarios
- **Unit Tests** - Service and guard testing with mocks
- **Mocking** - External dependencies and authentication logic

## 🏗️ Architecture

### User Management System with RBAC
- **Authentication**: JWT-based with local strategy
- **Authorization**: Role and permission-based access control
- **User Roles**: Admin, Manager, User, Guest
- **Permissions**: Granular permission system for fine-grained access control

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based route protection
- Permission-based access control
- Input validation with class-validator
- Structured error responses

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data transfer objects
│   ├── guards/             # Authentication guards
│   ├── strategies/         # Passport strategies
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      # Auth module configuration
├── users/                  # Users module
│   ├── dto/                # User DTOs
│   ├── users.controller.ts # User endpoints
│   ├── users.service.ts    # User business logic
│   └── users.module.ts     # User module configuration
├── common/                 # Shared utilities
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   ├── guards/             # Custom guards
│   └── types/              # Type definitions
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Run the application:**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

4. **Access the application:**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

## 🧪 Testing

### Run all tests:
```bash
npm test
```

### Run specific test suites:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test scenarios covered:
- ✅ User registration and login
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Permission-based access control
- ✅ Protected route access
- ✅ Error handling and validation
- ✅ Custom decorator functionality

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh

### Users (Protected)
- `GET /users` - Get all users (Admin/Manager)
- `GET /users/profile` - Get current user profile
- `GET /users/:id` - Get user by ID (Admin/Manager)
- `POST /users` - Create user (Admin)
- `PATCH /users/profile` - Update own profile
- `PATCH /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)
- `PATCH /users/:id/activate` - Activate user (Admin/Manager)
- `PATCH /users/:id/deactivate` - Deactivate user (Admin/Manager)

## 🔐 Security Features

### Role-Based Access Control (RBAC)
- **Admin**: Full system access
- **Manager**: User management access
- **User**: Profile access only
- **Guest**: No access

### Permission System
- `read:users` - Read user data
- `write:users` - Create/update users
- `delete:users` - Delete users
- `read:profile` - Read own profile
- `write:profile` - Update own profile
- `manage:system` - System administration

### Security Best Practices
- Password hashing with bcrypt
- JWT token expiration
- Input validation and sanitization
- Structured error responses (no sensitive data leakage)
- Role and permission-based authorization
- Public route bypass for authentication

## 🎯 Advanced Concepts Demonstrated

### 1. Custom Decorators
```typescript
// Extract current user
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}

// Role-based access
@Get('admin-only')
@Roles(UserRole.ADMIN)
adminOnly() {
  return 'Admin access granted';
}

// Permission-based access
@Get('users')
@RequirePermissions(Permission.READ_USERS)
getUsers() {
  return this.usersService.findAll();
}
```

### 2. Guard Implementation
```typescript
// JWT Authentication with public route support
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic ? true : super.canActivate(context);
  }
}
```

### 3. Exception Filter
```typescript
// Global exception handling
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    // Structured error response with logging
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };
    response.status(status).json(errorResponse);
  }
}
```

### 4. Testing with Mocks
```typescript
// Service testing with mocked dependencies
describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
  });
});
```

## 🚀 Getting Started

1. **Clone and install:**
   ```bash
   git clone <repository>
   cd nestjs-adv-poc
   npm install
   ```

2. **Start the application:**
   ```bash
   npm run start:dev
   ```

3. **Test the API:**
   - Visit http://localhost:3000/api for Swagger documentation
   - Register a new user
   - Login to get JWT token
   - Test protected endpoints with different roles

4. **Run tests:**
   ```bash
   npm test
   npm run test:e2e
   ```

## 📖 Learning Outcomes

This POC demonstrates:
- ✅ Custom decorator creation and usage
- ✅ Advanced guard implementation with multiple strategies
- ✅ Global and custom exception filters
- ✅ Comprehensive testing with mocks and E2E scenarios
- ✅ Role-based and permission-based access control
- ✅ JWT authentication with Passport strategies
- ✅ Input validation and error handling
- ✅ Swagger API documentation
- ✅ TypeScript best practices
- ✅ NestJS module architecture

## 🤝 Contributing

This is a demonstration project showcasing advanced NestJS concepts. Feel free to explore, modify, and extend the functionality to learn more about NestJS advanced features.

## 📄 License

MIT License - feel free to use this code for learning and development purposes.
