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
import { registerAndLoginTestUser } from './helper';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';

describe('Drawer API Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

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

    const signinResponse = await registerAndLoginTestUser(app);
    accessToken = signinResponse.accessToken;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
    const server = app.getHttpServer();
    server.close();
  });

  it('[suceess] 찜 서랍을 정상적으로 생성한다', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '테스트 생성 찜박스',
      })
      .expect(201);

    expect(res.body.data).toEqual({
      id: 1,
      name: '테스트 생성 찜박스',
      thumbnails: [],
    });
  });

  it('[fail] 중복된 이름으로 생성한 찜박스는 실패한다', async () => {
    await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '테스트 생성 찜박스2',
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '테스트 생성 찜박스2',
      })
      .expect(409);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.DRAWER.DUPLICATE_NAME);
  });
});
