import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters';
import { TokenService } from 'src/token/token.service';
import { ResponseInterceptor } from 'src/common/interceptors';
import request from 'supertest';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';

describe('User API With AutGuard Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    tokenService = moduleFixture.get<TokenService>(TokenService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    const server = app.getHttpServer();
    server.close();
  });

  it('[sucess] 유저 정보를 수령한다', async () => {
    const { accessToken } = tokenService.signAccessToken({
      userId: 1,
      userEmail: 'test@test.com',
      userNickname: 'tester',
    });

    const res = await request(app.getHttpServer())
      .get('/v1/user/info')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toEqual({
      id: 1,
      email: 'test@test.com',
      nickname: 'tester',
    });
  });

  it('[sucess] 유저 정보를 성공적으로 수령한다', async () => {
    const { accessToken } = tokenService.signAccessToken({
      userId: 1,
      userEmail: 'test@test.com',
      userNickname: 'tester',
    });

    const res = await request(app.getHttpServer())
      .get('/v1/user/info')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toEqual({
      id: 1,
      email: 'test@test.com',
      nickname: 'tester',
    });
  });

  it('[fail] 토큰이 존재하지 않아 실패합니다', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/user/info')
      .expect(401);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.AUTH.TOKEN_IS_MISSING);
  });

  it('[fail] 유효하지 않은 토큰을 사용하여 실패합니다', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/user/info')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.AUTH.INVALID_TOKEN);
  });

  it('[fail] 만료된 토큰을 사용하여 실패합니다', async () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNCwidXNlckVtYWlsIjoidGVzdDJAZW1haWwuY29tIiwidXNlck5pY2tuYW1lIjoi7LWc7KCc7JuQMiIsImlhdCI6MTc0NDUzNTE1MSwiZXhwIjoxNzQ0NTM1MTUyfQ.lcgLYvPwRa-njsZApUPM-VKPbdpGfOD5TIyMypTpPcs';

    const res = await request(app.getHttpServer())
      .get('/v1/user/info')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.AUTH.TOKEN_EXPIRED);
  });
});
