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
  registerUser,
  userCreateDrawer,
} from './helper';
import { DrawerRepository } from 'src/drawer/drawer.repository';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { ProductRepository } from 'src/product/product.repository';

describe('ZZIM API Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let drawerRepository: DrawerRepository;
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
    drawerRepository = moduleFixture.get<DrawerRepository>(DrawerRepository);
    productRepository = moduleFixture.get<ProductRepository>(ProductRepository);
  });

  it('[success] 유저가 성공적으로 찜을 생성한다', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const res = await request(app.getHttpServer())
      .post(`/v1/zzim/1`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(201);

    const drawerListApi = await drawerRepository.getMyDrawerListWithSkipAndTake(
      newUser.id,
      { page: 1, size: 10 },
    );

    const beforeCreatedDrawer = drawerListApi.drawerList[0];
    expect(res.body.data.drawer_id).toBe(newDrawer.id);
    expect(res.body.data.user_id).toBe(newUser.id);
    expect(res.body.data.product_id).toBe(1);
    expect(beforeCreatedDrawer.zzim_count).toEqual(1);
    expect(beforeCreatedDrawer.thumbnails).toEqual([
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

    const drawerListApi = await drawerRepository.getMyDrawerListWithSkipAndTake(
      newUser.id,
      { page: 1, size: 10 },
    );

    const beforeCreatedDrawer = drawerListApi.drawerList[0];

    const expectedThumbnail = [
      product[4].thumbnail,
      product[3].thumbnail,
      product[2].thumbnail,
      product[1].thumbnail,
    ];

    expect(beforeCreatedDrawer.zzim_count).toEqual(5);
    expect(beforeCreatedDrawer.thumbnails).toEqual(expectedThumbnail);
  });

  it('[fail] 존재하지 않은 아이템을 찜 하려는 경우 404', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    const res = await request(app.getHttpServer())
      .post(`/v1/zzim/4000`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(EXCEPTION_MESSAGE.ITEM.NOT_FOUN_ITEM);
  });
  3;
  it('[fail] 찜을 진행하려는 상품이 이미 내 찜에 존재하는 경우 409 ', async () => {
    const newUser = await registerUser(app);
    const userLoginInfo = await loginUser(app, newUser);

    const newUserAccessToken = userLoginInfo.accessToken;

    const newDrawer = await userCreateDrawer(app, newUserAccessToken);

    await request(app.getHttpServer())
      .post(`/v1/zzim/1`)
      .set('Authorization', `Bearer ${newUserAccessToken}`)
      .send({
        drawer_id: newDrawer.id,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post(`/v1/zzim/1`)
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
  ``;
});
