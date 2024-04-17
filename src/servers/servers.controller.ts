import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  ParseIntPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { UsersService } from 'src/users/users.service';

@Controller('servers')
export class ServersController {
  constructor(
    private readonly serversService: ServersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() createServerDto: CreateServerDto) {
    return this.serversService.create(createServerDto, req.user.id);
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.serversService.findAll({ userId: req.user.id, limit, offset });
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const isOwner = await this.usersService.isOwner(req.user.id, id);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this server');
    }
    const server = await this.serversService.findOne({ id });
    if (!server) {
      throw new NotFoundException('Server not found');
    }
    return server;
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    const isOwner = await this.usersService.isOwner(req.user.id, id);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this server');
    }
    const server = await this.serversService.findOne({ id });
    if (!server) {
      throw new NotFoundException();
    }
    return this.serversService.update(id, updateServerDto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const isOwner = await this.usersService.isOwner(req.user.id, id);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this server');
    }
    const server = await this.serversService.findOne({ id });
    if (!server) {
      throw new NotFoundException();
    }
    return this.serversService.remove(id);
  }
}
