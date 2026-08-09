import { ConfigService } from '@nestjs/config';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

describe('RefreshTokenIdsStorage', () => {
  // onApplicationBootstrap() is deliberately not invoked here — it opens a
  // real Redis connection.
  it('should be defined', () => {
    expect(new RefreshTokenIdsStorage(new ConfigService())).toBeDefined();
  });
});
