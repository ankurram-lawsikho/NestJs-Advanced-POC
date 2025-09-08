import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PublicUser } from '../types/user.types';

/**
 * Custom decorator to extract the current user from the request
 * This decorator simplifies access to user data in controllers
 */
export const CurrentUser = createParamDecorator(
  (data: keyof PublicUser | undefined, ctx: ExecutionContext): PublicUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // If a specific property is requested, return only that property
    return data ? user[data] : user;
  },
);
