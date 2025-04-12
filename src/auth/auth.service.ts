import { HttpException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import * as argon2 from 'argon2';
import { SignupDto, SignupResponse } from './dto/signup.dto';
import { SigninDto, SigninResponse } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(signUpDto: SignupDto): Promise<SignupResponse> {
    const existingUser = await this.authRepository.getUserByEmail(
      signUpDto.email,
    );

    if (existingUser) {
      throw new HttpException(EXCEPTION_MESSAGE.USER.DUPLICATE_EMAIL, 409);
    }

    const signUpInfo = {
      ...signUpDto,
      password: await this.hashedPassword(signUpDto.password),
    };

    const { id, email, nickname } =
      await this.authRepository.saveUser(signUpInfo);

    return { id, email, nickname };
  }

  async signin(signInDto: SigninDto): Promise<SigninResponse> {
    const exisitngUser = await this.authRepository.getUserByEmail(
      signInDto.email,
    );

    if (!exisitngUser) {
      throw new HttpException(
        EXCEPTION_MESSAGE.USER.INVALID_EMAIL_OR_PASSWORD,
        409,
      );
    }

    const comparePassword = await this.comparePassword(
      exisitngUser.password,
      signInDto.password,
    );

    if (!comparePassword) {
      throw new HttpException(
        EXCEPTION_MESSAGE.USER.INVALID_EMAIL_OR_PASSWORD,
        409,
      );
    }

    return this.tokenService.signAccessToken({
      userId: exisitngUser.id,
      userEmail: exisitngUser.email,
      userNickname: exisitngUser.nickname,
    });
  }

  /**
   *
   * @param userPassword 기존 유저 암호화된 비밀번호
   * @param inputPassword 유저가 입력한 평문 비밀번호
   * @returns true || false
   */
  private async comparePassword(
    userPassword: string,
    inputPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(userPassword, inputPassword, {
      secret: Buffer.from(this.configService.get('HASH_PASSWORD_SECRET')),
    });
  }

  /**
   *
   * 유저의 비밀번호를 암호화합니다
   *
   * @param password
   * @returns 해쉬된 비밀번호
   */
  private async hashedPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      secret: Buffer.from(this.configService.get('HASH_PASSWORD_SECRET')),
    });
  }
}
