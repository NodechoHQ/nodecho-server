import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    const matchedUser = await this.usersService.findOne({ email });
    if (matchedUser) {
      throw new BadRequestException('Email already exists');
    }
    const passwordHash = await this.authService.hashPassword(password);
    return this.usersService.create({ name, email, passwordHash });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findOne({ id: req.user.id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-verify-email')
  async sendVerifyEmail(@Req() req: any) {
    return this.authService.sendVerifyEmail({ userId: req.user.id });
  }

  @Public()
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
