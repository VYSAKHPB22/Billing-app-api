import { UserRole } from '../../common/enums/user-role.enum';

export interface RequestUser {
  sub: string;
  id: string;
  shopId: string;
  username: string;
  role: UserRole;
}
