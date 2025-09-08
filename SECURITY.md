# 🔐 Security Features

This NestJS application implements comprehensive security measures to protect against common web vulnerabilities and attacks.

## 🛡️ Security Headers (Helmet.js)

### Content Security Policy (CSP)
- **defaultSrc**: `'self'` - Only allow resources from same origin
- **styleSrc**: `'self' 'unsafe-inline'` - Allow inline styles for Swagger UI
- **scriptSrc**: `'self'` - Only allow scripts from same origin
- **imgSrc**: `'self' data: https:` - Allow images from same origin, data URIs, and HTTPS
- **connectSrc**: `'self'` - Only allow connections to same origin
- **objectSrc**: `'none'` - Block all object/embed/embed elements
- **frameSrc**: `'none'` - Block all frames

### HTTP Strict Transport Security (HSTS)
- **maxAge**: 31536000 (1 year)
- **includeSubDomains**: true
- **preload**: true

### Other Security Headers
- **X-Content-Type-Options**: `nosniff` - Prevent MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevent clickjacking
- **X-XSS-Protection**: `1; mode=block` - Enable XSS filtering
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **X-Powered-By**: Removed - Hide server technology
- **DNS Prefetch Control**: Enabled
- **IE No Open**: Enabled
- **No Sniff**: Enabled

## 🚦 Rate Limiting

### General Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Standard rate limit headers included

### Authentication Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Applied to**: `/auth/*` routes
- **Purpose**: Prevent brute force attacks

## 🌐 CORS Configuration

### Development
- **Origins**: `http://localhost:3000`, `http://localhost:3001`
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With
- **Credentials**: true
- **Max Age**: 24 hours

### Production
- **Origins**: Configurable via `ALLOWED_ORIGINS` environment variable
- **Same security settings as development**

## 🔑 Authentication & Authorization

### JWT Authentication
- **Algorithm**: HS256
- **Expiration**: Configurable (default: 1 hour)
- **Secret**: Environment variable `JWT_SECRET`
- **Bearer Token**: Required for protected routes

### Role-Based Access Control (RBAC)
- **Admin**: Full system access
- **Manager**: User management access
- **User**: Profile access only
- **Guest**: No access

### Permission-Based Access Control
- **read:users** - Read user data
- **write:users** - Create/update users
- **delete:users** - Delete users
- **read:profile** - Read own profile
- **write:profile** - Update own profile
- **manage:system** - System administration

## 🔒 Data Protection

### Password Security
- **Hashing**: bcrypt with salt rounds
- **Minimum Length**: 6 characters
- **Validation**: Strong password requirements

### Input Validation
- **Whitelist**: Only allowed properties
- **Forbid Non-Whitelisted**: Reject unknown properties
- **Transform**: Automatic type conversion
- **Sanitization**: XSS protection

### Error Handling
- **Structured Responses**: No sensitive data leakage
- **Global Exception Filter**: Consistent error format
- **Logging**: Security events logged

## 🚫 CSRF Protection

### Current Implementation
- **JWT Bearer Tokens**: Stateless authentication (CSRF-resistant)
- **No Cookies**: Session-based CSRF not applicable
- **API-First**: Primarily REST API (low CSRF risk)

### Additional Protection
- **SameSite Cookies**: If cookies are used
- **CSRF Tokens**: Can be added for web forms
- **Origin Validation**: CORS configuration

## 🔍 Security Monitoring

### Headers Added
- **Cache Control**: No-cache for sensitive endpoints
- **Security Headers**: Comprehensive protection
- **Rate Limit Headers**: Request tracking

### Logging
- **Authentication Events**: Login/logout attempts
- **Authorization Failures**: Access denied events
- **Rate Limit Violations**: Excessive requests

## 🛠️ Configuration

### Environment Variables
```bash
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Database Security
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secure-password
DATABASE_NAME=nestjs_adv_poc
```

### Security Configuration File
- **Location**: `src/security/security.config.ts`
- **Customizable**: Helmet and CORS settings
- **Environment-aware**: Different settings for dev/prod

## 🚨 Security Best Practices

### Development
1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Regular security audits** of dependencies
5. **Input validation** on all endpoints

### Production
1. **Use strong JWT secrets** (32+ characters)
2. **Enable HTTPS only** (HSTS preload)
3. **Monitor rate limits** and failed attempts
4. **Regular security updates** of dependencies
5. **Database connection encryption**

## 🔧 Security Testing

### Automated Tests
- **E2E Tests**: Authentication and authorization
- **Unit Tests**: Security guards and decorators
- **Integration Tests**: Rate limiting and CORS

### Manual Testing
- **Security Headers**: Verify with browser dev tools
- **Rate Limiting**: Test with multiple requests
- **CORS**: Test cross-origin requests
- **Authentication**: Test JWT token validation

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
