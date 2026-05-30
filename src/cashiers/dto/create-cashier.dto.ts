import { UserRole } from '../../common/enums/user-role.enum';

export class CreateCashierDto {
  name: string;
  shopId: string;
  username: string;
  password: string;
  phone: string;
  role?: UserRole;
  isActive?: boolean;
}
