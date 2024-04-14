import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { z } from 'zod';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() createServerDto: CreateServerDto) {
    const authUserSchema = z.object({ userId: z.number().int() });
    const result = authUserSchema.safeParse(req.user);
    if (!result.success) {
      throw new UnauthorizedException();
    }
    return this.serversService.create(createServerDto, result.data.userId);
  }

  @Get()
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.serversService.findAll({ limit, offset });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const server = await this.serversService.findOne(id);
    if (!server) {
      throw new NotFoundException();
    }
    return server;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    const server = await this.serversService.findOne(id);
    if (!server) {
      throw new NotFoundException();
    }
    return this.serversService.update(id, updateServerDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const server = await this.serversService.findOne(id);
    if (!server) {
      throw new NotFoundException();
    }
    return this.serversService.remove(id);
  }
}
