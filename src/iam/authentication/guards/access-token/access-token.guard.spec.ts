import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import JwtConfig from '../../../config/jwt.config';
import { AccessTokenGuard } from './access-token.guard';

describe('AccessTokenGuard', () => {
  const jwtConfig = {
    secret: 'test-secret',
    audience: 'test-audience',
    issuer: 'test-issuer',
    ignoreExpiration: false,
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
  } as ConfigType<typeof JwtConfig>;

  it('should be defined', () => {
    expect(new AccessTokenGuard(new JwtService(), jwtConfig)).toBeDefined();
  });
});
