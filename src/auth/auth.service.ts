import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.schema';
import { z } from 'zod';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<Env>,
  ) {}

  async validateUser(email: string, password: string) {
    return this.usersService.validatePassword(email, password);
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async sendVerifyEmail({ userId }: { userId: number }) {
    const DOMAIN = this.configService.getOrThrow('DOMAIN', { infer: true });
    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.emailVerifiedAt && user.emailVerifiedAt.getTime() < Date.now()) {
      throw new BadRequestException('Email already verified');
    }
    if (
      user.lastVerifyingEmailAt &&
      user.lastVerifyingEmailAt.getTime() > Date.now() - 60 * 1000
    ) {
      throw new NotAcceptableException('Email already sent recently');
    }
    const token = this.jwtService.sign(
      { sub: userId },
      {
        notBefore: 0,
        expiresIn: '1h',
        issuer: `${DOMAIN}|verify-email`,
      },
    );
    // TODO: Implement this at the client side
    const verificationLink = `${DOMAIN}/auth/verify?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify Email',
      // TODO: Polish HTML template
      html: `<a href="${verificationLink}">Verify Email</a>`,
    });
    await this.usersService.updateLastVerifyingEmailAt(user.email);
  }

  async verifyToken(token: string) {
    const DOMAIN = this.configService.getOrThrow('DOMAIN', { infer: true });
    const rawJwt = this.jwtService.verify(token);
    const schema = z.object({
      iss: z.literal(`${DOMAIN}|verify-email`),
      sub: z.number().int(),
    });
    const jwt = schema.parse(rawJwt);
    const user = await this.usersService.findOne({ id: jwt.sub });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.usersService.markEmailVerified(user.email);
  }
}
