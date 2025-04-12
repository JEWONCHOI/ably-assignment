import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from 'src/common/filters';
import { ResponseInterceptor } from 'src/common/interceptors';
import {
  generateRandomEmail,
  generateRandomString,
} from 'src/common/utils/function';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';

describe('Auth API Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let loginTestEmail: string;
  let loginTestPassword = 'testpassword';

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
    await app.init();

    dataSource = app.get<DataSource>('DATA_SOURCE');

    loginTestEmail = generateRandomEmail();
    await request(app.getHttpServer()).post('/v1/auth/signup').send({
      email: loginTestEmail,
      nickname: generateRandomString(),
      password: loginTestPassword,
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
    const server = app.getHttpServer();
    server.close();
  });

  it('[sucess] 회원 가입을 성공합니다', async () => {
    const testEmail = generateRandomEmail();
    const testNickname = generateRandomString();

    const res = await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send({
        email: testEmail,
        nickname: testNickname,
        password: 'testpassword',
      })
      .expect(201);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toEqual(testEmail);
    expect(res.body.data.nickname).toEqual(testNickname);
    expect('password' in res.body.data).toBe(false);
  });

  it('[fail] 중복 이메일 회원가입은 실패합니다', async () => {
    const duplicateEmail = generateRandomEmail();

    await request(app.getHttpServer()).post('/v1/auth/signup').send({
      email: duplicateEmail,
      nickname: generateRandomString(),
      password: 'testpassword',
    });

    const res = await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send({
        email: duplicateEmail,
        nickname: generateRandomString(),
        password: 'testpassword',
      })
      .expect(409);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.USER.DUPLICATE_EMAIL);
  });

  it('[sucess] 로그인에 성공합니다', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/signin')
      .send({
        email: loginTestEmail,
        password: loginTestPassword,
      })
      .expect(201);

    expect(res.body.data).toBeTruthy();
    expect(res.body.data).toHaveProperty('accessToken');
    expect(typeof res.body.data.accessToken).toBe('string');
  });

  it('[fail] 이메일이 틀린 경우 로그인에 실패합니다', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/signin')
      .send({
        email: 'invalid@emial.com',
        password: loginTestPassword,
      })
      .expect(401);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      EXCEPTION_MESSAGE.USER.INVALID_EMAIL_OR_PASSWORD,
    );
  });

  it('[fail] 비밀번호가 틀린 경우 로그인에 실패합니다', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/signin')
      .send({
        email: loginTestEmail,
        password: 'wrongpassword',
      })
      .expect(401);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      EXCEPTION_MESSAGE.USER.INVALID_EMAIL_OR_PASSWORD,
    );
  });
});
