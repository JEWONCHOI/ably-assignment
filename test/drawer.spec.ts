import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from 'src/common/filters';
import { ResponseInterceptor } from 'src/common/interceptors';
import { generateRandomString } from 'src/common/utils/function';
import { registerAndLoginTestUser, userCreateDrawer } from './helper';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';

describe('Drawer API Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let anonymousToken: string;

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

    const anonymousUserResponse = await registerAndLoginTestUser(app);
    anonymousToken = anonymousUserResponse.accessToken;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
    const server = app.getHttpServer();
    server.close();
  });

  it('[suceess] 찜 서랍을 정상적으로 생성한다', async () => {
    const boxName = generateRandomString();
    const res = await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: boxName,
      })
      .expect(201);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toEqual(boxName);
    expect(res.body.data.thumbnails).toEqual([]);
  });

  it('[fail] 중복된 이름으로 생성한 찜박스는 실패한다', async () => {
    const boxName = generateRandomString();
    await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: boxName,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: boxName,
      })
      .expect(409);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.DRAWER.DUPLICATE_NAME);
  });

  it('[success] 찜박스를 성공적으로 삭제한다', async () => {
    const boxName = generateRandomString();

    const beforeCreateBox = await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: boxName,
      })
      .expect(201);

    const createdBoxId = beforeCreateBox.body.data.id;

    const res = await request(app.getHttpServer())
      .delete(`/v1/drawer/${createdBoxId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toBe('OK');
  });

  it('[fail] 존재하지 않은 찜박스를 삭제한다면 실패한다', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/v1/drawer/5000`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND,
    );
  });

  it('[fail] 자신의 것이 아닌 찜박스를 삭제한다면 실패한다', async () => {
    const anonymousCreatRes = await request(app.getHttpServer())
      .post('/v1/drawer')
      .set('Authorization', `Bearer ${anonymousToken}`)
      .send({
        name: generateRandomString(),
      })
      .expect(201);

    const anonymousBox = anonymousCreatRes.body.data;

    const res = await request(app.getHttpServer())
      .delete(`/v1/drawer/${anonymousBox.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER);
  });

  it('[success] 자신의 찜박스 목록을 조회한다', async () => {
    const newUserResponse = await registerAndLoginTestUser(app);
    const newUserAccessToken = newUserResponse.accessToken;

    const drawers = [];
    for (let i = 0; i < 4; i++) {
      const drawer = await userCreateDrawer(app, newUserAccessToken);
      drawers.push(drawer);
    }

    const res = await request(app.getHttpServer())
      .get('/v1/drawer?page=1&size=10')
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .expect(200);

    expect(res.body.data.drawerList.length).toEqual(4);
    expect(res.body.data.totalElement).toEqual(4);
    expect(res.body.data.totalPages).toEqual(1);
    expect(res.body.data.currentPage).toEqual(1);

    for (let i = 0; i < drawers.length; i++) {
      const reverseDrawer = drawers[drawers.length - 1 - i];
      const curSaveDrawer = res.body.data.drawerList[i];

      expect(reverseDrawer.id).toEqual(curSaveDrawer.id);
      expect(reverseDrawer.name).toEqual(curSaveDrawer.name);
    }
  });
});
