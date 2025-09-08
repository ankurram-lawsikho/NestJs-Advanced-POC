import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole, Permission } from '../common/types/user.types';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    role: UserRole.USER,
    permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: UserRole.USER,
        permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
        isActive: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
    });

    it('should return null when user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const mockToken = 'mock-jwt-token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: UserRole.USER,
          permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: UserRole.USER,
        permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
      });
    });
  });

  describe('register', () => {
    it('should register a new user with default permissions', async () => {
      const hashedPassword = 'hashedpassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      
      const newUser = {
        ...mockUser,
        id: '2',
        email: 'newuser@example.com',
        username: 'newuser',
        password: hashedPassword,
      };
      
      usersService.create.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(
        'newuser@example.com',
        'newuser',
        'password123',
        UserRole.USER,
      );

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        username: 'newuser',
        password: hashedPassword,
        role: UserRole.USER,
        permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
      });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should register admin with all permissions', async () => {
      const hashedPassword = 'hashedpassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      
      const adminUser = {
        ...mockUser,
        id: '3',
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
        permissions: Object.values(Permission),
      };
      
      usersService.create.mockResolvedValue(adminUser);
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(
        'admin@example.com',
        'admin',
        'password123',
        UserRole.ADMIN,
      );

      expect(usersService.create).toHaveBeenCalledWith({
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
        permissions: Object.values(Permission),
      });
    });
  });
});
