import { Test, TestingModule } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { PrismaService } from 'src/database/prisma.service';

describe('ServersService', () => {
  let service: ServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServersService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
