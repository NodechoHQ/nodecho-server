import { Inject, Injectable } from '@nestjs/common';
import { MetricData } from './dto/create-metric.dto';
import {
  DatabaseProvider,
  kDatabaseProvider,
} from 'src/database/database.provider';
import { metrics } from 'src/database/schema';
import { desc, eq } from 'drizzle-orm';

type CreateMetricParams = {
  serverId: number;
  data: MetricData;
};

@Injectable()
export class MetricsService {
  constructor(
    @Inject(kDatabaseProvider) private readonly db: DatabaseProvider,
  ) {}

  async create({ serverId, data }: CreateMetricParams): Promise<number> {
    const newMetrics = await this.db
      .insert(metrics)
      .values({
        serverId: serverId,
        version: data.version,
        uptime: data.uptime,
        sessions: data.sessions,
        processes: data.processes,
        processesArray: data.processes_array,
        fileHandles: data.file_handles,
        fileHandlesLimit: data.file_handles_limit,
        osKernel: data.os_kernel,
        osName: data.os_name,
        osArch: data.os_arch,
        cpuName: data.cpu_name,
        cpuCores: data.cpu_cores,
        cpuFreq: data.cpu_freq,
        ramTotal: data.ram_total,
        ramUsage: data.ram_usage,
        swapTotal: data.swap_total,
        swapUsage: data.swap_usage,
        diskArray: data.disk_array,
        diskTotal: data.disk_total,
        diskUsage: data.disk_usage,
        connections: data.connections,
        nic: data.nic,
        ipv4: data.ipv4,
        ipv6: data.ipv6,
        rx: data.rx,
        tx: data.tx,
        rxGap: data.rx_gap,
        txGap: data.tx_gap,
        load: data.load,
        loadCPU: data.load_cpu,
        loadIO: data.load_io,
        pingEU: data.ping_eu,
        pingUS: data.ping_us,
        pingAS: data.ping_as,
      })
      .returning();
    return newMetrics[0].id;
  }

  async findAll(params: {
    serverId: number;
    limit?: number;
    offset?: number;
  }): Promise<(typeof metrics.$inferSelect)[]> {
    return this.db.query.metrics.findMany({
      where: eq(metrics.serverId, params.serverId),
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      orderBy: desc(metrics.createdAt),
    });
  }
}
