import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types/user.types';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator to specify required roles for a route
 * This decorator works with the RolesGuard to enforce role-based access control
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
