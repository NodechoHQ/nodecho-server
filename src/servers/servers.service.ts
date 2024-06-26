import { Inject, Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import {
  DatabaseProvider,
  kDatabaseProvider,
} from 'src/database/database.provider';
import { servers } from 'src/database/schema';
import { eq } from 'drizzle-orm';

type ServerDto = typeof servers.$inferSelect;

type FindOneParams = { id: number } | { token: string };

@Injectable()
export class ServersService {
  constructor(
    @Inject(kDatabaseProvider) private readonly db: DatabaseProvider,
  ) {}

  async create(
    createServerDto: CreateServerDto,
    userId: number,
  ): Promise<ServerDto> {
    const newServers = await this.db
      .insert(servers)
      .values({
        name: createServerDto.name,
        ownerId: userId,
        dataLossAlertEnabled: createServerDto.dataLossAlertEnabled,
        missedDataThreshold: createServerDto.missedDataThreshold,
        additionalPingCheckEnabled: createServerDto.additionalPingCheck,
        resourceUsageAlertEnabled: createServerDto.resourceUsageAlertEnabled,
        systemLoadThreshold: createServerDto.systemLoadThreshold,
        ramUsageThreshold: createServerDto.memoryUsageThreshold,
        diskUsageThreshold: createServerDto.diskUsageThreshold,
      })
      .returning();
    return newServers[0];
  }

  async findAll(params: {
    userId: number;
    limit?: number;
    offset?: number;
  }): Promise<ServerDto[]> {
    return this.db.query.servers.findMany({
      where: (servers, { eq }) => eq(servers.ownerId, params.userId),
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      orderBy: (servers, { desc }) => desc(servers.createdAt),
    });
  }

  async findOne(params: FindOneParams): Promise<ServerDto | null> {
    const server = await this.db.query.servers.findFirst({
      where: (servers, { eq }) => {
        if ('id' in params) {
          return eq(servers.id, params.id);
        } else {
          return eq(servers.token, params.token);
        }
      },
    });
    return server ?? null;
  }

  async update(
    id: number,
    updateServerDto: UpdateServerDto,
  ): Promise<ServerDto> {
    const updatedServers = await this.db
      .update(servers)
      .set({
        name: updateServerDto.name,
        dataLossAlertEnabled: updateServerDto.dataLossAlertEnabled,
        missedDataThreshold: updateServerDto.missedDataThreshold,
        additionalPingCheckEnabled: updateServerDto.additionalPingCheck,
        resourceUsageAlertEnabled: updateServerDto.resourceUsageAlertEnabled,
        systemLoadThreshold: updateServerDto.systemLoadThreshold,
        ramUsageThreshold: updateServerDto.memoryUsageThreshold,
        diskUsageThreshold: updateServerDto.diskUsageThreshold,
      })
      .where(eq(servers.id, id))
      .returning();
    return updatedServers[0];
  }

  async remove(id: number): Promise<ServerDto> {
    const deletedServers = await this.db
      .delete(servers)
      .where(eq(servers.id, id))
      .returning();
    return deletedServers[0];
  }
}
