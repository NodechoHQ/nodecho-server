import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  async create(@Body() createServerDto: CreateServerDto) {
    return this.serversService.create(createServerDto);
  }

  @Get()
  async findAll() {
    return this.serversService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.serversService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    const server = await this.serversService.findOne(+id);
    if (!server) {
      throw new NotFoundException();
    }
    return this.serversService.update(+id, updateServerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const server = await this.serversService.findOne(+id);
    if (!server) {
      throw new NotFoundException();
    }
    return this.serversService.remove(+id);
  }
}
