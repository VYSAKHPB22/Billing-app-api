import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Message } from '../common/decorators/message.decorator';
import { ApiStandardErrors } from '../common/decorators/swagger.decorator';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import type { RequestUser } from './interfaces/request-user.interface';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterCashierDto,
  RegisterShopDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Message('Shop registered successfully')
  @ApiOperation({
    summary: 'Register a shop and owner account',
    description:
      'Creates a new shop and its first ADMIN user. Tokens are not returned from registration.',
  })
  @ApiBody({ type: RegisterShopDto })
  @ApiCreatedResponse({
    description: 'Shop and owner account registered successfully',
  })
  @ApiStandardErrors({ conflict: true })
  registerShop(@Body() dto: RegisterShopDto) {
    return this.authService.registerShop(dto);
  }

  @Post('register-cashier')
  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Message('Cashier registered successfully')
  @ApiOperation({
    summary: 'Register a cashier under a shop',
    description:
      'Creates a CASHIER user for the authenticated admin shop. Admins cannot create cashiers for another shop.',
  })
  @ApiBody({ type: RegisterCashierDto })
  @ApiCreatedResponse({ description: 'Cashier registered successfully' })
  @ApiStandardErrors({ auth: true, conflict: true, forbidden: true })
  registerCashier(
    @Body() dto: RegisterCashierDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.authService.registerCashier(dto, user);
  }

  @Post('login')
  @Message('Login successful')
  @ApiOperation({
    summary: 'Login with username',
    description:
      'Authenticates an active user and returns access and refresh tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiStandardErrors()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Message('Token refreshed successfully')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Validates a refresh token using the refresh secret and returns new tokens.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Token refreshed successfully' })
  @ApiStandardErrors()
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }
}
