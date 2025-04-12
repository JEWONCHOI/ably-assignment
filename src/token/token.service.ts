import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwt from 'jsonwebtoken';
import {
  SignAccessTokenDto,
  SignAccessTokenResponse,
} from './dto/sign-access-token.dto';
import { VerifyTokenDto, VerifyTokenResponse } from './dto/verify-token.dto';
@Injectable()
export class TokenService {
  private readonly jwtAlorithm: jwt.SignOptions;

  constructor(
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAlorithm = {
      expiresIn: '24h',
      algorithm: 'HS256',
    };
  }

  /**
   * 유저 정보가 담긴 payload를 사용하여 JWT Acess Token을 발급합니다
   *
   * @param payload 유저 정보 객체
   * @returns accessToken을 포함한 JWT 문자열 객체 (예: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
   */
  signAccessToken(payload: SignAccessTokenDto): SignAccessTokenResponse {
    return { accessToken: this.jwtservice.sign(payload, this.jwtAlorithm) };
  }

  /**
   * JWT 토큰을 검증하여 그 유효성을 확인합니다.
   *
   * @param param0 검증할 JWT accessToken이 포함된 객체
   * @returns 유효한 토큰일시에 유저 객체를, 유효하지 않으면 예외를 던집니다.
   */
  verifyToken({ accessToken }: VerifyTokenDto): VerifyTokenResponse {
    return this.jwtservice.verify(accessToken);
  }
}
