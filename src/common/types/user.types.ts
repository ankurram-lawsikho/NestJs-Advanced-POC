export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

export enum Permission {
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  READ_PROFILE = 'read:profile',
  WRITE_PROFILE = 'write:profile',
  MANAGE_SYSTEM = 'manage:system',
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
