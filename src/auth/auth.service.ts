import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BusinessAdminsService } from '../business-admins/business-admins.service';
import { CashiersService } from '../cashiers/cashiers.service';
import { UserRole } from '../common/enums/user-role.enum';
import { ShopsService } from '../shops/shops.service';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterCashierDto,
  RegisterShopDto,
} from './dto/auth.dto';
import { RequestUser } from './interfaces/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly businessAdminsService: BusinessAdminsService,
    private readonly cashiersService: CashiersService,
    private readonly shopsService: ShopsService,
    private readonly jwtService: JwtService,
  ) {}

  async registerShop(dto: RegisterShopDto) {
    await this.ensureUsernameAvailable(dto.username);

    const shop = await this.shopsService.create({
      shopName: dto.shopName,
      shopEmail: dto.shopEmail,
      phone: dto.phone,
      isActive: true,
    });

    const owner = await this.businessAdminsService.create({
      name: dto.shopName,
      shopId: shop._id.toString(),
      username: dto.username,
      password: dto.password,
      phone: dto.phone,
      role: UserRole.ADMIN,
      isActive: true,
    });

    return {
      shop: {
        id: shop._id,
        shopName: shop.shopName,
        shopEmail: shop.shopEmail,
        phone: shop.phone,
        isActive: shop.isActive,
      },
      owner: {
        id: owner._id,
        name: owner.name,
        username: owner.username,
        role: owner.role,
      },
    };
  }

  async registerCashier(dto: RegisterCashierDto, currentUser: RequestUser) {
    if (currentUser.shopId !== dto.shopId) {
      throw new ForbiddenException('Cannot create cashier for another shop');
    }

    await this.ensureUsernameAvailable(dto.username);

    const cashier = await this.cashiersService.create({
      name: dto.name,
      shopId: dto.shopId,
      phone: dto.phone,
      username: dto.username,
      password: dto.password,
      role: UserRole.CASHIER,
      isActive: true,
    });

    return {
      id: cashier._id,
      name: cashier.name,
      shopId: cashier.shopId,
      username: cashier.username,
      role: cashier.role,
      isActive: cashier.isActive,
    };
  }

  async login(dto: LoginDto) {
    const user =
      (await this.businessAdminsService.findByUsername(dto.username)) ||
      (await this.cashiersService.findByUsername(dto.username));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.signTokens(
      user._id.toString(),
      user.shopId.toString(),
      user.username,
      user.role,
    );

    return tokens;
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: {
      sub: string;
      shopId: string;
      username: string;
      role: UserRole;
    };

    try {
      payload = this.jwtService.verify<{
        sub: string;
        shopId: string;
        username: string;
        role: UserRole;
      }>(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'billing-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user =
      payload.role === UserRole.ADMIN
        ? await this.businessAdminsService.findById(payload.sub)
        : await this.cashiersService.findById(payload.sub);

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.signTokens(
      user._id.toString(),
      user.shopId.toString(),
      user.username,
      user.role,
    );
  }

  private async signTokens(
    id: string,
    shopId: string,
    username: string,
    role: UserRole,
  ) {
    const payload = { sub: id, shopId, username, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'billing-access-secret',
        expiresIn: (process.env.JWT_ACCESS_EXPIRY || '1d') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'billing-refresh-secret',
        expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async ensureUsernameAvailable(username: string) {
    const existingUser =
      (await this.businessAdminsService.findByUsername(username)) ||
      (await this.cashiersService.findByUsername(username));

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
  }
}
