import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from '../../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../../iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token doesn't provided");
    }

    try {
      request[REQUEST_USER_KEY] = await this.jwtService.verifyAsync(
        token,
        this.jwtConfig,
      );
    } catch {
      throw new UnauthorizedException('Wrong token');
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
