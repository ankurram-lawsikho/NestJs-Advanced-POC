import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, PublicUser, UserRole, Permission } from '../common/types/user.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      permissions: createUserDto.permissions || [],
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as PublicUser;
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.findById(id);
    
    await this.usersRepository.update(id, updateUserDto);
    
    const updatedUser = await this.findById(id);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as PublicUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async deactivate(id: string): Promise<PublicUser> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<PublicUser> {
    return this.update(id, { isActive: true });
  }
}
