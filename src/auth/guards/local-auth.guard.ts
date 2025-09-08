import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard
 * This guard uses the local passport strategy for username/password authentication
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
