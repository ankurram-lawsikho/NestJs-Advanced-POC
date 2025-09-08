import { SetMetadata } from '@nestjs/common';
import { Permission } from '../types/user.types';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Custom decorator to specify required permissions for a route
 * This decorator works with the PermissionsGuard to enforce permission-based access control
 */
export const RequirePermissions = (...permissions: Permission[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);
