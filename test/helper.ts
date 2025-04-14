import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  generateRandomEmail,
  generateRandomString,
} from 'src/common/utils/function';
import { CreateDrawerResponse } from 'src/drawer/dto/create-drawer.dto';
import { SignupResponse } from 'src/auth/dto/signup.dto';

export interface TestUserInfo {
  accessToken: string;
}

const password = 'testpassword';

export async function registerUser(
  app: INestApplication,
): Promise<SignupResponse> {
  const email = generateRandomEmail();
  const nickname = generateRandomString();

  const res = await request(app.getHttpServer())
    .post('/v1/auth/signup')
    .send({ email, nickname, password })
    .expect(201);

  return { id: res.body.data.id, email, nickname };
}

export async function loginUser(
  app: INestApplication,
  userInfo: SignupResponse,
) {
  const res = await request(app.getHttpServer())
    .post('/v1/auth/signin')
    .send({ email: userInfo.email, password })
    .expect(201);

  return { accessToken: res.body.data.accessToken };
}

export async function registerAndLoginTestUser(
  app: INestApplication,
): Promise<TestUserInfo> {
  const email = generateRandomEmail();
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

export async function createZzim(
  app: INestApplication,
  darwerId: number,
  accessToken: string,
  productId: number,
) {
  const res = await request(app.getHttpServer())
    .post(`/v1/products/${productId}/zzim`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      drawer_id: darwerId,
    });

  return res.body.data;
}

export async function userCreateDrawer(
  app: INestApplication,
  accessToken: string,
): Promise<CreateDrawerResponse> {
  const res = await request(app.getHttpServer())
    .post('/v1/drawers')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: generateRandomString(),
    })
    .expect(201);

  return res.body.data;
}
