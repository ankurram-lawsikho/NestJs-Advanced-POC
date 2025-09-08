import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        statusCode: 429,
        message: 'Too many requests from this IP, please try again later.',
        error: 'Too Many Requests',
      });
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  private readonly authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
      error: 'Too many authentication attempts from this IP, please try again later.',
      statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        statusCode: 429,
        message: 'Too many authentication attempts from this IP, please try again later.',
        error: 'Too Many Requests',
      });
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.authLimiter(req, res, next);
  }
}
