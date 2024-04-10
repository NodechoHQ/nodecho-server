import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<Omit<User, 'passwordHash'>> {
    const { passwordHash, ...user } = await this.prisma.user.create({ data });
    passwordHash;
    return user;
  }
}
