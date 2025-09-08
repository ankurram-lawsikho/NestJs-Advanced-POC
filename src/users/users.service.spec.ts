import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole, Permission } from '../common/types/user.types';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'hashedpassword',
        role: UserRole.USER,
        permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
      };

      const result = await service.create(createUserDto);

      expect(result).toMatchObject({
        email: 'newuser@example.com',
        username: 'newuser',
        role: UserRole.USER,
        permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
        isActive: true,
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        email: 'admin@example.com', // This email exists in the mock data
        username: 'newuser',
        password: 'hashedpassword',
        role: UserRole.USER,
      };

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      result.forEach(user => {
        expect(user).not.toHaveProperty('password');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('role');
      });
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const result = await service.findById('1');

      expect(result).toMatchObject({
        id: '1',
        email: 'admin@example.com',
        username: 'admin',
        role: UserRole.ADMIN,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const result = await service.findByEmail('admin@example.com');

      expect(result).toMatchObject({
        id: '1',
        email: 'admin@example.com',
        username: 'admin',
        role: UserRole.ADMIN,
      });
    });

    it('should return null when user not found', async () => {
      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateUserDto = {
        username: 'updatedadmin',
        role: UserRole.MANAGER,
      };

      const result = await service.update('1', updateUserDto);

      expect(result).toMatchObject({
        id: '1',
        email: 'admin@example.com',
        username: 'updatedadmin',
        role: UserRole.MANAGER,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto = { username: 'updated' };

      await expect(service.update('999', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      // First create a user to remove
      const createUserDto = {
        email: 'toremove@example.com',
        username: 'toremove',
        password: 'hashedpassword',
        role: UserRole.USER,
      };
      const user = await service.create(createUserDto);

      await expect(service.remove(user.id)).resolves.not.toThrow();
      await expect(service.findById(user.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate user', async () => {
      const result = await service.deactivate('1');

      expect(result).toMatchObject({
        id: '1',
        isActive: false,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(service.deactivate('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    it('should activate user', async () => {
      // First deactivate the user
      await service.deactivate('1');

      const result = await service.activate('1');

      expect(result).toMatchObject({
        id: '1',
        isActive: true,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(service.activate('999')).rejects.toThrow(NotFoundException);
    });
  });
});
