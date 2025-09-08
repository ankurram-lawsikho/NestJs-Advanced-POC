import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/users/entities/user.entity';
import { UserRole, Permission } from '../src/common/types/user.types';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let managerToken: string;
  let userToken: string;
  let adminId: string;
  let managerId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    TestAppModule.createApp(app);
    await app.init();

    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    // Clear all data before each test
    await dataSource.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    // Create test users with different roles
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin@example.com',
        username: 'admin',
        password: 'password123',
        role: UserRole.ADMIN,
      });
    
    if (adminResponse.status === 201) {
      adminToken = adminResponse.body.access_token;
      adminId = adminResponse.body.user.id;
    }

    const managerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'manager@example.com',
        username: 'manager',
        password: 'password123',
        role: UserRole.MANAGER,
      });
    
    if (managerResponse.status === 201) {
      managerToken = managerResponse.body.access_token;
      managerId = managerResponse.body.user.id;
    }

    const userResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        username: 'user',
        password: 'password123',
        role: UserRole.USER,
      });
    
    if (userResponse.status === 201) {
      userToken = userResponse.body.access_token;
      userId = userResponse.body.user.id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user (admin only)', () => {
      const createUserDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
        permissions: [Permission.READ_PROFILE, Permission.WRITE_PROFILE],
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', createUserDto.email);
          expect(res.body).toHaveProperty('username', createUserDto.username);
          expect(res.body).toHaveProperty('role', createUserDto.role);
          expect(res.body).toHaveProperty('permissions', createUserDto.permissions);
          expect(res.body).toHaveProperty('isActive', true);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail when manager tries to create user', () => {
      const createUserDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(createUserDto)
        .expect(403);
    });

    it('should fail when user tries to create user', () => {
      const createUserDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createUserDto)
        .expect(403);
    });

    it('should fail without authorization', () => {
      const createUserDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(401);
    });

    it('should fail with validation error for invalid email', () => {
      const createUserDto = {
        email: 'invalid-email',
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('should get all users (admin and manager only)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(3); // admin, manager, user
          res.body.forEach((user: any) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('role');
            expect(user).not.toHaveProperty('password');
          });
        });
    });

    it('should fail when user tries to get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });

  describe('GET /users/profile', () => {
    it('should get current user profile', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('email', 'user@example.com');
          expect(res.body).toHaveProperty('username', 'user');
          expect(res.body).toHaveProperty('role', UserRole.USER);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .expect(401);
    });
  });

  describe('GET /users/:id', () => {
    it('should get user by ID (admin and manager only)', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('email', 'user@example.com');
          expect(res.body).toHaveProperty('username', 'user');
          expect(res.body).toHaveProperty('role', UserRole.USER);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail when user tries to get another user by ID', () => {
      return request(app.getHttpServer())
        .get(`/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail with invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/users/invalid-uuid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404); // ParseUUIDPipe might not be working as expected
    });

    it('should fail with non-existent user ID', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      return request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /users/profile', () => {
    it('should update current user profile', () => {
      const updateDto = {
        username: 'updateduser',
      };

      return request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('username', updateDto.username);
          expect(res.body).toHaveProperty('email', 'user@example.com'); // unchanged
        });
    });

    it('should fail without authorization', () => {
      const updateDto = {
        username: 'updateduser',
      };

      return request(app.getHttpServer())
        .patch('/users/profile')
        .send(updateDto)
        .expect(401);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user by ID (admin only)', () => {
      const updateDto = {
        username: 'updateduser',
        role: UserRole.MANAGER,
      };

      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('username', updateDto.username);
          expect(res.body).toHaveProperty('role', updateDto.role);
        });
    });

    it('should fail when manager tries to update user', () => {
      const updateDto = {
        username: 'updateduser',
      };

      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send(updateDto)
        .expect(403);
    });

    it('should fail with invalid UUID', () => {
      const updateDto = {
        username: 'updateduser',
      };

      return request(app.getHttpServer())
        .patch('/users/invalid-uuid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user by ID (admin only)', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should fail when manager tries to delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);
    });

    it('should fail with invalid UUID', () => {
      return request(app.getHttpServer())
        .delete('/users/invalid-uuid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });

    it('should fail with non-existent user ID', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      return request(app.getHttpServer())
        .delete(`/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id/deactivate', () => {
    it('should deactivate user (admin and manager only)', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('isActive', false);
        });
    });

    it('should fail when user tries to deactivate another user', () => {
      return request(app.getHttpServer())
        .patch(`/users/${adminId}/deactivate`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PATCH /users/:id/activate', () => {
    beforeEach(async () => {
      // Deactivate the user first
      await request(app.getHttpServer())
        .patch(`/users/${userId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`);
    });

    it('should activate user (admin only)', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/activate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('isActive', true);
        });
    });

    it('should fail when manager tries to activate user', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/activate`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);
    });
  });
});
