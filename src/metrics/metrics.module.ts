import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { ServersService } from 'src/servers/servers.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, ServersService, UsersService],
})
export class MetricsModule {}
