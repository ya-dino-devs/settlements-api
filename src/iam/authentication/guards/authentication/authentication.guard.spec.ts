import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import JwtConfig from '../../../config/jwt.config';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  const jwtConfig = {
    secret: 'test-secret',
    audience: 'test-audience',
    issuer: 'test-issuer',
    ignoreExpiration: false,
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
  } as ConfigType<typeof JwtConfig>;

  it('should be defined', () => {
    const accessTokenGuard = new AccessTokenGuard(new JwtService(), jwtConfig);

    expect(
      new AuthenticationGuard(new Reflector(), accessTokenGuard),
    ).toBeDefined();
  });
});
