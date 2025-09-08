import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../types/user.types';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockExecutionContext = (user: any, requiredRoles?: UserRole[]) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    if (requiredRoles) {
      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
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
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      const context = mockExecutionContext({ role: UserRole.USER });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      const user = { role: UserRole.ADMIN };
      const context = mockExecutionContext(user, [UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      const user = { role: UserRole.MANAGER };
      const context = mockExecutionContext(user, [UserRole.ADMIN, UserRole.MANAGER]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = mockExecutionContext(null, [UserRole.ADMIN]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      const user = { role: UserRole.USER };
      const context = mockExecutionContext(user, [UserRole.ADMIN]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Required roles: admin. Your role: user'
      );
    });

    it('should throw ForbiddenException with multiple required roles message', () => {
      const user = { role: UserRole.GUEST };
      const context = mockExecutionContext(user, [UserRole.ADMIN, UserRole.MANAGER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Required roles: admin, manager. Your role: guest'
      );
    });
  });
});
