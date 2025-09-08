import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsArray } from 'class-validator';
import { UserRole, Permission } from '../../common/types/user.types';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: UserRole.USER, 
    enum: UserRole,
    description: 'User role'
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ 
    example: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
    enum: Permission,
    isArray: true,
    required: false,
    description: 'User permissions'
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];
}
