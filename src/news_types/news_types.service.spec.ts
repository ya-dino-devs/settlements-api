import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsTypesService } from './news_types.service';
import { NewsTypes } from './entities/news_types.entity';

describe('NewsTypesService', () => {
  let service: NewsTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsTypesService,
        { provide: getRepositoryToken(NewsTypes), useValue: {} },
      ],
    }).compile();

    service = module.get<NewsTypesService>(NewsTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
