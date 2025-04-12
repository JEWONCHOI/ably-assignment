import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { EXCEPTION_MESSAGE } from '../exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const [, token] = authHeader?.split(' ') ?? [];

    if (!token) {
      throw new HttpException(EXCEPTION_MESSAGE.AUTH.TOKEN_IS_MISSING, 401);
    }

    try {
      const payload = this.tokenService.verifyToken({ accessToken: token });

      const { userId, userEmail, userNickname } = payload;

      request['user'] = {
        id: userId,
        email: userEmail,
        nickname: userNickname,
      };

      return true;
    } catch (err) {
      if (err?.message === 'jwt expired') {
        throw new UnauthorizedException(EXCEPTION_MESSAGE.AUTH.TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(EXCEPTION_MESSAGE.AUTH.INVALID_TOKEN);
    }
  }
}
