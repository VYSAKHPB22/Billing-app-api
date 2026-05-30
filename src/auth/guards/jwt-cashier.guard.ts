import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../common/enums/user-role.enum';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class JwtCashierGuard extends AuthGuard('jwt') {
  handleRequest<TUser = RequestUser>(error: unknown, user: RequestUser | false): TUser {
    if (error || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    if (user.role !== UserRole.CASHIER) {
      throw new ForbiddenException(
        'You do not have access to this cashier route',
      );
    }

    return user as TUser;
  }
}
