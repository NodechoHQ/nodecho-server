import { Test, TestingModule } from '@nestjs/testing';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { PrismaService } from 'src/database/prisma.service';

describe('ServersController', () => {
  let controller: ServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersController],
      providers: [ServersService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<ServersController>(ServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
