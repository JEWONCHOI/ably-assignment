import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from 'src/common/filters';
import { ResponseInterceptor } from 'src/common/interceptors';
import {
  createZzim,
  loginUser,
  registerAndLoginTestUser,
  registerUser,
  userCreateDrawer,
} from './helper';
import { DrawerRepository } from 'src/drawer/drawer.repository';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { ProductRepository } from 'src/product/product.repository';
import { ZzimItemRepository } from 'src/zzim-item/zzim-item.repository';

describe('ZZIM API Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let drawerRepository: DrawerRepository;
  let productRepository: ProductRepository;
  let zzimItemRepository: ZzimItemRepository;
  let anonymousDrawerId: number;
  let anonymouseAccessToken: string;

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

    const anonymousLogin = await registerAndLoginTestUser(app);
    anonymouseAccessToken = anonymousLogin.accessToken;
    const anonymousCreateDrawer = await userCreateDrawer(
      app,
      anonymouseAccessToken,
    );
    anonymousDrawerId = anonymousCreateDrawer.id;

    drawerRepository = moduleFixture.get<DrawerRepository>(DrawerRepository);
    productRepository = moduleFixture.get<ProductRepository>(ProductRepository);
    zzimItemRepository =
      moduleFixture.get<ZzimItemRepository>(ZzimItemRepository);
  });

  it('[success] 유저가 성공적으로 찜을 생성한다', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const res = await request(app.getHttpServer())
      .post(`/v1/product/1/zzim`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(201);

    const drawer = await drawerRepository.getDrawerById(newDrawer.id);

    expect(res.body.data.drawer_id).toBe(newDrawer.id);
    expect(res.body.data.user_id).toBe(newUser.id);
    expect(res.body.data.product_id).toBe(1);
    expect(drawer.zzim_count).toEqual(1);
    expect(drawer.thumbnails).toEqual([
      'https://image.com/products/thumbnail/product_0.jpeg',
    ]);
  });

  it('[success] 썸네일이 4개 이상일 때, 찜박스의 최신 찜한 상품 썸네일이 맨 앞에 오고 총 4개로 유지된다', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const product = [];

    for (let i = 1; i < 6; i++) {
      await createZzim(app, newDrawer.id, newUserAccessToken, i);
      product.push(await productRepository.gerProductById(i));
    }

    const drawer = await drawerRepository.getDrawerById(newDrawer.id);

    const expectedThumbnail = [
      product[4].thumbnail,
      product[3].thumbnail,
      product[2].thumbnail,
      product[1].thumbnail,
    ];

    expect(drawer.zzim_count).toEqual(5);
    expect(drawer.thumbnails).toEqual(expectedThumbnail);
  });

  it('[fail] 존재하지 않은 찜박스에 찜을 하려는 경우 404', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const res = await request(app.getHttpServer())
      .post(`/v1/product/1/zzim`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: 30000,
      })
      .expect(404);

    expect(res.body).toHaveProperty('message');

    expect(res.body.message).toContain(
      EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND,
    );
  });

  it('[fail] 찜박스가 자신의 소유가 아닌 경우 403', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const res = await request(app.getHttpServer())
      .post(`/v1/product/1/zzim`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: anonymousDrawerId,
      })
      .expect(403);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER);
  });

  it('[fail] 존재하지 않은 아이템을 찜 하려는 경우 404', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const res = await request(app.getHttpServer())
      .post(`/v1/product/40000/zzim`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.ITEM.NOT_FOUN_ITEM);
  });

  it('[fail] 찜을 진행하려는 상품이 이미 내 찜에 존재하는 경우 409 ', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    await request(app.getHttpServer())
      .post(`/v1/product/1/zzim`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post(`/v1/product/1/zzim`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(409);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      EXCEPTION_MESSAGE.ZZIM.DUPLICATE_ZZIM_ITEM,
    );
  });

  it('[success] 찜을 성공적으로 제거합니다 200', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const newZzim = await createZzim(app, newDrawer.id, newUserAccessToken, 1);

    const res = await request(app.getHttpServer())
      .delete(`/v1/zzim/${newZzim.id}`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .expect(200);

    const drawer = await drawerRepository.getDrawerById(newDrawer.id);
    const zzimItems = await zzimItemRepository.getMyZzimItemListByDrawerId(
      newDrawer.id,
      newUser.id,
    );

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual('OK');
    expect(zzimItems.length).toEqual(0);
    expect(drawer.zzim_count).toEqual(0);
    expect(drawer.thumbnails).toEqual([]);
  });

  it('[success] 5개 이상의 찜이 존재하는 찜박스의 찜을 삭제하면 썸네일 이미지가 최신순으로 정렬됩니다', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const product = [];
    const zzim = [];

    for (let i = 1; i < 6; i++) {
      zzim.push(await createZzim(app, newDrawer.id, newUserAccessToken, i));
      product.push(await productRepository.gerProductById(i));
    }

    await request(app.getHttpServer())
      .delete(`/v1/zzim/${zzim[zzim.length - 1].id}`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .expect(200);

    const drawer = await drawerRepository.getDrawerById(newDrawer.id);

    const expectedThumbnails = product
      .slice(0, -1)
      .reverse()
      .map((p) => p.thumbnail);

    expect(drawer.thumbnails).toEqual(expectedThumbnails);
  });

  it('[fail] 존재하지 않는 찜을 조회하는 경우 404', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/v1/zzim/30000`)
      .set('Authorization', `Bearer ${anonymouseAccessToken}`)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.ZZIM.NOT_FOUND_ZZIM);
  });

  it('[fail] 찜의 주인이 자신이 아닌 경우', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const zzim = await createZzim(app, newDrawer.id, newUserAccessToken, 1);

    const res = await request(app.getHttpServer())
      .delete(`/v1/zzim/${zzim.id}`)
      .set('Authorization', `Bearer ${anonymouseAccessToken}`)
      .expect(403);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.ZZIM.NOT_MY_ZZIM);
  });
});
