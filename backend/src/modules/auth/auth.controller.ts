import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './dto/auth.dto';
import { Public, CurrentUser, JwtPayload } from '../../common/decorators';
import { zodValidate } from '../../common/utils';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: RegisterDto) {
    const validated = zodValidate(registerSchema, body);
    return this.authService.register(validated);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() body: LoginDto) {
    const validated = zodValidate(loginSchema, body);
    return this.authService.login(validated);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: RefreshTokenDto) {
    const validated = zodValidate(refreshTokenSchema, body);
    const payload = await this.authService.validateRefreshToken(
      validated.refreshToken,
    );
    return this.authService.refreshTokens(payload.sub, validated.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@CurrentUser() user: JwtPayload) {
    await this.authService.logout(user.sub);
    return { message: 'Logged out successfully' };
  }
}
