import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let managerToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test users and get tokens
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin@test.com',
        username: 'admin',
        password: 'password123',
        role: 'admin',
      });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'manager@test.com',
        username: 'manager',
        password: 'password123',
        role: 'manager',
      });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@test.com',
        username: 'user',
        password: 'password123',
        role: 'user',
      });

    // Login and get tokens
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      });

    const managerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'manager@test.com',
        password: 'password123',
      });

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });

    adminToken = adminLogin.body.access_token;
    managerToken = managerLogin.body.access_token;
    userToken = userLogin.body.access_token;
  });

  describe('GET /users', () => {
    it('should allow admin to get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should allow manager to get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);
    });

    it('should deny regular user access to get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should deny access without token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });

  describe('GET /users/profile', () => {
    it('should allow user to get their own profile', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('user@test.com');
          expect(res.body.username).toBe('user');
        });
    });

    it('should deny access without token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .expect(401);
    });
  });

  describe('POST /users', () => {
    it('should allow admin to create new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'newuser@test.com',
          username: 'newuser',
          password: 'password123',
          role: 'user',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe('newuser@test.com');
          expect(res.body.username).toBe('newuser');
          expect(res.body.role).toBe('user');
        });
    });

    it('should deny manager access to create user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          email: 'newuser2@test.com',
          username: 'newuser2',
          password: 'password123',
          role: 'user',
        })
        .expect(403);
    });

    it('should deny regular user access to create user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: 'newuser3@test.com',
          username: 'newuser3',
          password: 'password123',
          role: 'user',
        })
        .expect(403);
    });
  });

  describe('PATCH /users/profile', () => {
    it('should allow user to update their own profile', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          username: 'updateduser',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.username).toBe('updateduser');
        });
    });

    it('should deny access without token', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          username: 'updateduser',
        })
        .expect(401);
    });
  });

  describe('DELETE /users/:id', () => {
    let userId: string;

    beforeEach(async () => {
      // Create a user to delete
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'todelete@test.com',
          username: 'todelete',
          password: 'password123',
          role: 'user',
        });

      userId = createResponse.body.id;
    });

    it('should allow admin to delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should deny manager access to delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);
    });

    it('should deny regular user access to delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
