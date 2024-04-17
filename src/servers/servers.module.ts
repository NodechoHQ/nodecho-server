import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ServersController],
  providers: [ServersService, UsersService],
})
export class ServersModule {}
