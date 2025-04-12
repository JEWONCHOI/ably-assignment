import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  generateRandomEmail,
  generateRandomString,
} from 'src/common/utils/function';
import { CreateDrawerResponse } from 'src/drawer/dto/create-drawer.dto';

export interface TestUserInfo {
  accessToken: string;
}

export async function registerAndLoginTestUser(
  app: INestApplication,
): Promise<TestUserInfo> {
  const email = generateRandomEmail();
  const password = 'testpassword';
  const nickname = generateRandomString();

  await request(app.getHttpServer())
    .post('/v1/auth/signup')
    .send({ email, nickname, password })
    .expect(201);

  const res = await request(app.getHttpServer())
    .post('/v1/auth/signin')
    .send({ email, password })
    .expect(201);

  return { accessToken: res.body.data.accessToken };
}

export async function userCreateDrawer(
  app: INestApplication,
  accessToken: string,
): Promise<CreateDrawerResponse> {
  const boxName = generateRandomString();

  const res = await request(app.getHttpServer())
    .post('/v1/drawer')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: boxName,
    })
    .expect(201);

  return res.body.data;
}
