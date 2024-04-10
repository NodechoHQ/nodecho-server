import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServersModule } from './servers/servers.module';
import { DatabaseModule } from './database/prisma.module';
import { MetricsModule } from './metrics/metrics.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EnvSchema } from './env.schema';

@Module({
  imports: [
    ServersModule,
    DatabaseModule,
    MetricsModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => EnvSchema.parse(env),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
