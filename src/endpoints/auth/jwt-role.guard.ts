import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRoleAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly role: string,
    private readonly permissions: string[] = [],
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    // Check if the user has the required role
    if (user.role !== this.role) {
      throw new UnauthorizedException('Invalid role');
    }

    if (user.permissions) {
      if (user.permissions) {
        for (let i = 0; i < this.permissions.length; i++) {
          if (!user.permissions.includes(this.permissions[i])) {
            throw new UnauthorizedException('Invalid permissions');
          }
        }
      }
    }
    return user;
  }
}
