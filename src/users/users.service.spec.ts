import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserRole, Permission } from '../common/types/user.types';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<UserEntity>>;

  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    username: 'admin',
    password: 'hashedpassword',
    role: UserRole.ADMIN,
    permissions: Object.values(Permission),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      const createdUser = { ...mockUser, ...createUserDto };
      repository.findOne.mockResolvedValue(null); // No existing user
      repository.create.mockReturnValue(createdUser as any);
      repository.save.mockResolvedValue(createdUser as any);

      const result = await service.create(createUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        permissions: createUserDto.permissions,
      });
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        email: 'admin@example.com',
        username: 'newuser',
        password: 'hashedpassword',
        role: UserRole.USER,
      };

      repository.findOne.mockResolvedValue(mockUser as any);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [mockUser, { ...mockUser, id: '2', email: 'user2@example.com' }];
      repository.find.mockResolvedValue(users as any);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
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
      repository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.findById('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      repository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.findByEmail('admin@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'admin@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateUserDto = {
        username: 'updatedadmin',
        role: UserRole.MANAGER,
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      repository.findOne.mockResolvedValueOnce(mockUser as any); // findById call
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValueOnce(updatedUser as any); // findById call after update

      const result = await service.update('1', updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto = { username: 'updated' };
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateUserDto)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      repository.findOne.mockResolvedValue(mockUser as any);
      repository.remove.mockResolvedValue(mockUser as any);

      await service.remove('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('deactivate', () => {
    it('should deactivate user', async () => {
      const deactivatedUser = { ...mockUser, isActive: false };
      repository.findOne.mockResolvedValueOnce(mockUser as any); // findById call
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValueOnce(deactivatedUser as any); // findById call after update

      const result = await service.deactivate('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.update).toHaveBeenCalledWith('1', { isActive: false });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.deactivate('999')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('activate', () => {
    it('should activate user', async () => {
      const activatedUser = { ...mockUser, isActive: true };
      repository.findOne.mockResolvedValueOnce(mockUser as any); // findById call
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValueOnce(activatedUser as any); // findById call after update

      const result = await service.activate('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.update).toHaveBeenCalledWith('1', { isActive: true });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.activate('999')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });
});
