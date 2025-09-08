import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole, Permission } from '../common/types/user.types';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async seed() {
    // Check if admin user already exists
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
      // Create admin user
      const adminUser = this.usersRepository.create({
        email: 'admin@example.com',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.ADMIN,
        permissions: Object.values(Permission),
        isActive: true,
      });

      await this.usersRepository.save(adminUser);
      console.log('✅ Admin user created');
    }

    // Check if manager user already exists
    const existingManager = await this.usersRepository.findOne({
      where: { email: 'manager@example.com' },
    });

    if (!existingManager) {
      // Create manager user
      const managerUser = this.usersRepository.create({
        email: 'manager@example.com',
        username: 'manager',
        password: await bcrypt.hash('manager123', 10),
        role: UserRole.MANAGER,
        permissions: [
          Permission.READ_USERS,
          Permission.WRITE_USERS,
          Permission.READ_PROFILE,
          Permission.WRITE_PROFILE,
        ],
        isActive: true,
      });

      await this.usersRepository.save(managerUser);
      console.log('✅ Manager user created');
    }

    console.log('🎉 Database seeding completed');
  }
}
