import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMetricDto, MetricData } from './dto/create-metric.dto';
import { MetricsService } from './metrics.service';
import { ServersService } from 'src/servers/servers.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly serversService: ServersService,
  ) {}

  @Post()
  async create(@Body() createMetricDto: CreateMetricDto) {
    const server = await this.serversService.findByToken(createMetricDto.token);
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
    @Query('serverId', ParseIntPipe) serverId: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.metricsService.findAll({ serverId, limit, offset });
  }
}
