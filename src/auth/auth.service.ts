import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, PublicUser, UserRole, Permission, JwtPayload } from '../common/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<PublicUser | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as PublicUser;
  }

  async login(user: PublicUser) {
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  async register(email: string, username: string, password: string, role: UserRole = UserRole.USER) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get default permissions based on role
    const defaultPermissions = this.getDefaultPermissions(role);
    
    const user = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
      role,
      permissions: defaultPermissions,
    });

    return this.login(user);
  }

  private getDefaultPermissions(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        return Object.values(Permission);
      case UserRole.MANAGER:
        return [
          Permission.READ_USERS,
          Permission.WRITE_USERS,
          Permission.READ_PROFILE,
          Permission.WRITE_PROFILE,
        ];
      case UserRole.USER:
        return [
          Permission.READ_PROFILE,
          Permission.WRITE_PROFILE,
        ];
      case UserRole.GUEST:
        return [];
      default:
        return [];
    }
  }
}
