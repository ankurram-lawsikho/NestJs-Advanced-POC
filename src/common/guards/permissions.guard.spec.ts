import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { Permission } from '../types/user.types';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockExecutionContext = (user: any, requiredPermissions?: Permission[]) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    if (requiredPermissions) {
      reflector.getAllAndOverride.mockReturnValue(requiredPermissions);
    } else {
      reflector.getAllAndOverride.mockReturnValue(undefined);
    }

    return context;
  };

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when no permissions are required', () => {
      const context = mockExecutionContext({ permissions: [Permission.READ_PROFILE] });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has all required permissions', () => {
      const user = {
        permissions: [Permission.READ_USERS, Permission.WRITE_USERS, Permission.READ_PROFILE],
      };
      const context = mockExecutionContext(user, [Permission.READ_USERS, Permission.WRITE_USERS]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has more permissions than required', () => {
      const user = {
        permissions: [Permission.READ_USERS, Permission.WRITE_USERS, Permission.DELETE_USERS],
      };
      const context = mockExecutionContext(user, [Permission.READ_USERS]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = mockExecutionContext(null, [Permission.READ_USERS]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should throw ForbiddenException when user has no permissions', () => {
      const user = { permissions: [] };
      const context = mockExecutionContext(user, [Permission.READ_USERS]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Missing permissions: read:users'
      );
    });

    it('should throw ForbiddenException when user is missing some permissions', () => {
      const user = {
        permissions: [Permission.READ_USERS],
      };
      const context = mockExecutionContext(user, [Permission.READ_USERS, Permission.WRITE_USERS]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Missing permissions: write:users'
      );
    });

    it('should throw ForbiddenException when user is missing multiple permissions', () => {
      const user = {
        permissions: [Permission.READ_PROFILE],
      };
      const context = mockExecutionContext(user, [
        Permission.READ_USERS,
        Permission.WRITE_USERS,
        Permission.DELETE_USERS,
      ]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Missing permissions: read:users, write:users, delete:users'
      );
    });

    it('should handle user with undefined permissions', () => {
      const user = {}; // No permissions property
      const context = mockExecutionContext(user, [Permission.READ_USERS]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Missing permissions: read:users'
      );
    });
  });
});
