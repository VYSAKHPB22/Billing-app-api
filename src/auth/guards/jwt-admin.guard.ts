import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../common/enums/user-role.enum';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser = RequestUser>(error: unknown, user: RequestUser | false): TUser {
    if (error || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have access to this admin route',
      );
    }

    return user as TUser;
  }
}
