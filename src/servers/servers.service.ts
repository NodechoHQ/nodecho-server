import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Server } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServerDto: CreateServerDto): Promise<Server> {
    return this.prisma.server.create({
      data: {
        name: createServerDto.name,
        dataLossAlertEnabled: createServerDto.dataLossAlertEnabled,
        missedDataThreshold: createServerDto.missedDataThreshold,
        additionalPingCheckEnabled: createServerDto.additionalPingCheck,
        resourceUsageAlertEnabled: createServerDto.resourceUsageAlertEnabled,
        systemLoadThreshold: createServerDto.systemLoadThreshold,
        ramUsageThreshold: createServerDto.memoryUsageThreshold,
        diskUsageThreshold: createServerDto.diskUsageThreshold,
      },
    });
  }

  async findAll(): Promise<Server[]> {
    return this.prisma.server.findMany();
  }

  async findOne(id: number): Promise<Server | null> {
    return this.prisma.server.findUnique({
      where: { id: id },
    });
  }

  async update(id: number, updateServerDto: UpdateServerDto): Promise<Server> {
    return this.prisma.server.update({
      data: {
        name: updateServerDto.name,
        dataLossAlertEnabled: updateServerDto.dataLossAlertEnabled,
        missedDataThreshold: updateServerDto.missedDataThreshold,
        additionalPingCheckEnabled: updateServerDto.additionalPingCheck,
        resourceUsageAlertEnabled: updateServerDto.resourceUsageAlertEnabled,
        systemLoadThreshold: updateServerDto.systemLoadThreshold,
        ramUsageThreshold: updateServerDto.memoryUsageThreshold,
        diskUsageThreshold: updateServerDto.diskUsageThreshold,
      },
      where: { id: id },
    });
  }

  async remove(id: number): Promise<Server> {
    return this.prisma.server.delete({
      where: { id: id },
    });
  }
}
