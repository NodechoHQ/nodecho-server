import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreateMetricDto, MetricData } from './dto/create-metric.dto';
import { MetricsService } from './metrics.service';
import { ServersService } from 'src/servers/servers.service';
import { Public } from 'src/auth/public.decorator';
import { UsersService } from 'src/users/users.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly serversService: ServersService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createMetricDto: CreateMetricDto) {
    const server = await this.serversService.findOne({
      token: createMetricDto.token,
    });
    if (!server) {
      throw new BadRequestException('Invalid token');
    }
    const metricPayload: MetricData | null = CreateMetricDto.parseData(
      createMetricDto.data,
    );
    if (!metricPayload) {
      throw new BadRequestException('Invalid data');
    }
    const metricId = await this.metricsService.create({
      serverId: server.id,
      data: metricPayload,
    });

    return { id: metricId };
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('serverId', ParseIntPipe) serverId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    const isOwner = await this.usersService.isOwner(req.user.id, serverId);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this server');
    }
    const server = await this.serversService.findOne({ id: serverId });
    if (!server) {
      throw new BadRequestException('Server not found');
    }
    return this.metricsService.findAll({ serverId, limit, offset });
  }
}
