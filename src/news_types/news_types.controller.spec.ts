import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsTypesController } from './news_types.controller';
import { NewsTypesService } from './news_types.service';
import { NewsTypes } from './entities/news_types.entity';

describe('NewsTypesController', () => {
  let controller: NewsTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsTypesController],
      providers: [
        NewsTypesService,
        { provide: getRepositoryToken(NewsTypes), useValue: {} },
      ],
    }).compile();

    controller = module.get<NewsTypesController>(NewsTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
