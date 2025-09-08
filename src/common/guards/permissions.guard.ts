import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../types/user.types';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Permissions Guard - Implements permission-based access control
 * This guard checks if the user has the required permissions to access a route
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasPermission = requiredPermissions.every((permission) => 
      user.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      const missingPermissions = requiredPermissions.filter(
        permission => !user.permissions?.includes(permission)
      );
      
      throw new ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(', ')}`
      );
    }

    return true;
  }
}
