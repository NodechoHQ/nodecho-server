import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    console.log('req.user', req.user);
    const user = await this.usersService.findOne({ id: req.user.id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verify-email')
  async sendVerifyEmail(@Request() req: any) {
    return this.authService.sendVerifyEmail({ userId: req.user.id });
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
