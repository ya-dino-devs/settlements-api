import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { HashingService } from '../hashing/hashing.service';
import JwtConfig from '../config/jwt.config';
import { Users } from '../../users/entities/users.entity';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: getRepositoryToken(Users), useValue: {} },
        { provide: HashingService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: JwtConfig.KEY, useValue: {} },
        { provide: RefreshTokenIdsStorage, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
