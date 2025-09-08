import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { RateLimitMiddleware, AuthRateLimitMiddleware } from './common/middleware/rate-limit.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply security middleware to all routes
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*');

    // Apply rate limiting to all routes
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');

    // Apply stricter rate limiting to auth routes
    consumer
      .apply(AuthRateLimitMiddleware)
      .forRoutes('auth/*');
  }
}
