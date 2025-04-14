import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { setupSwagger } from 'src/docs/initailize';

describe('Swagger 셋업', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({}).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('스웨거를 성공적으로 초기화합니다', () => {
    expect(() => setupSwagger(app)).not.toThrow();
  });
});
