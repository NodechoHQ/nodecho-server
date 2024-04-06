import { IsString, IsUUID } from 'class-validator';
import { z } from 'zod';

export class CreateMetricDto {
  @IsUUID()
  token: string;

  @IsString()
  data: string;

  static parseData(data: string): MetricData | null {
    const decodedDataArray = data
      .split(' ')
      .map((value) => Buffer.from(value, 'base64').toString());
    const keys = [
      'version',
      'uptime',
      'sessions',
      'processes',
      'processes_array',
      'file_handles',
      'file_handles_limit',
      'os_kernel',
      'os_name',
      'os_arch',
      'cpu_name',
      'cpu_cores',
      'cpu_freq',
      'ram_total',
      'ram_usage',
      'swap_total',
      'swap_usage',
      'disk_array',
      'disk_total',
      'disk_usage',
      'connections',
      'nic',
      'ipv4',
      'ipv6',
      'rx',
      'tx',
      'rx_gap',
      'tx_gap',
      'load',
      'load_cpu',
      'load_io',
      'ping_eu',
      'ping_us',
      'ping_as',
    ] as const;
    if (keys.length !== decodedDataArray.length) {
      return null;
    }
    const decodedDataObject = keys.reduce<Record<string, string>>(
      (acc, key, index) => {
        acc[key] = decodedDataArray[index];
        return acc;
      },
      {},
    );
    const parsed = MetricDataSchema.safeParse(decodedDataObject);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  }
}

const MetricDataSchema = z.object({
  version: z.string(),
  uptime: z.coerce.number().int(),
  sessions: z.string(),
  processes: z.string(),
  processes_array: z.string(),
  file_handles: z.string(),
  file_handles_limit: z.string(),
  os_kernel: z.string(),
  os_name: z.string(),
  os_arch: z.string(),
  cpu_name: z.string(),
  cpu_cores: z.string(),
  cpu_freq: z.string(),
  ram_total: z.coerce.number().int(),
  ram_usage: z.coerce.number().int(),
  swap_total: z.coerce.number().int(),
  swap_usage: z.coerce.number().int(),
  disk_array: z.string(),
  disk_total: z.coerce.number().int(),
  disk_usage: z.coerce.number().int(),
  connections: z.coerce.number().int(),
  nic: z.string(),
  ipv4: z.string(),
  ipv6: z.string(),
  rx: z.coerce.number().int(),
  tx: z.coerce.number().int(),
  rx_gap: z.coerce.number().int(),
  tx_gap: z.coerce.number().int(),
  load: z.string(),
  load_cpu: z.string(),
  load_io: z.string(),
  ping_eu: z.coerce.number(),
  ping_us: z.coerce.number(),
  ping_as: z.coerce.number(),
});

export type MetricData = z.infer<typeof MetricDataSchema>;
