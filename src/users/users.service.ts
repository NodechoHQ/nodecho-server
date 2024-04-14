import { Inject, Injectable } from '@nestjs/common';
import { users } from 'src/database/schema';
import {
  DatabaseProvider,
  kDatabaseProvider,
} from 'src/database/database.provider';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

type UserDto = Omit<typeof users.$inferSelect, 'passwordHash'>;
type FindUserParams = { email: string } | { id: number };

@Injectable()
export class UsersService {
  constructor(
    @Inject(kDatabaseProvider) private readonly db: DatabaseProvider,
  ) {}

  async findOne(params: FindUserParams): Promise<UserDto | null> {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => {
        if ('id' in params) {
          return eq(users.id, params.id);
        } else {
          return eq(users.email, params.email);
        }
      },
      columns: { passwordHash: false },
    });
    return user ?? null;
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<UserDto> {
    const newUserIds: { id: number }[] = await this.db
      .insert(users)
      .values(data)
      .returning({ id: users.id });
    const newUserId = newUserIds[0].id;
    const newUser = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, newUserId),
      columns: { passwordHash: false },
    });
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<UserDto | null> {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }
    const sanitizedUser = { ...user, passwordHash: undefined };
    return sanitizedUser;
  }

  async updateLastVerifyingEmailAt(email: string): Promise<void> {
    await this.db
      .update(users)
      .set({ lastVerifyingEmailAt: new Date() })
      .where(eq(users.email, email));
  }

  async markEmailVerified(email: string): Promise<void> {
    await this.db
      .update(users)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(users.email, email));
  }
}
