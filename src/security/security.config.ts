import { ConfigService } from '@nestjs/config';

export const getSecurityConfig = (configService: ConfigService) => ({
  helmet: {
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    // Hide X-Powered-By header
    hidePoweredBy: true,
    // HSTS (HTTP Strict Transport Security)
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    // IE No Open
    ieNoOpen: true,
    // No Sniff
    noSniff: true,
    // XSS Filter
    xssFilter: true,
  },
  cors: {
    origin: configService.get('NODE_ENV') === 'production' 
      ? configService.get('ALLOWED_ORIGINS', '').split(',') || ['https://yourdomain.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
});
