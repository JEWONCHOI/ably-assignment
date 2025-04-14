import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from 'src/common/filters';
import { ResponseInterceptor } from 'src/common/interceptors';
import { generateRandomString } from 'src/common/utils/function';
import {
  createZzim,
  loginUser,
  registerAndLoginTestUser,
  userCreateDrawer,
} from './helper';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { ProductRepository } from 'src/product/product.repository';

describe('Drawer API Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let anonymousToken: string;
  let anonymousDrawerId: number;
  let productRepository: ProductRepository;

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
    const anonymousDrawer = await userCreateDrawer(app, anonymousToken);
    anonymousDrawerId = anonymousDrawer.id;

    productRepository = moduleFixture.get<ProductRepository>(ProductRepository);
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

  it('[sucess] 커서기반 drawer 목록 페이징 조회', async () => {
    const userLoginInfo = await registerAndLoginTestUser(app);
    const newUserAccessToken = userLoginInfo.accessToken;

    for (let i = 1; i <= 4; i++) {
      await userCreateDrawer(app, newUserAccessToken);
    }

    const firstResponse = await request(app.getHttpServer())
      .get(`/v1/drawer?size=2`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .expect(200);

    const firstItems = firstResponse.body.data.data;
    const nextCursor = firstResponse.body.data.meta.nextCursor;

    expect(firstItems).toHaveLength(2);
    expect(typeof nextCursor).toBe('number');

    const secondResponse = await request(app.getHttpServer())
      .get(`/v1/drawer?size=2&cursor=${nextCursor}`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .expect(200);

    const secondItems = secondResponse.body.data.data;

    expect(secondItems).toHaveLength(2);
    expect(secondItems[0].id).toBeLessThan(nextCursor);
    expect(secondItems[1].id).toBeLessThan(secondItems[0].id);

    const allItems = [...firstItems, ...secondItems];
    for (let i = 1; i < allItems.length; i++) {
      expect(allItems[i].id).toBeLessThan(allItems[i - 1].id);
    }
  });

  it('[fail] 존재하지 않는 찜박스 내부의 찜 아이템을 조회하려고 할 때 404', async () => {
    const res = await request(app.getHttpServer())
      .get(`/v1/drawer/50000/zzim?size=10`)
      .set('Authorization', `Bearer ${anonymousToken}`)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND,
    );
  });

  it('[fail] 내 찜박스가 아닌 찜박스의 내부의 찜 아이템을 조회하려고 할 때 403', async () => {
    const resLogin = registerAndLoginTestUser(app);
    const newUserAccessToken = (await resLogin).accessToken;

    const res = await request(app.getHttpServer())
      .get(`/v1/drawer/${anonymousDrawerId}/zzim?size=10`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .expect(403);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER);
  });
});
