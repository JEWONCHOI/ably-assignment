import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { exceptionForm } from '../example/form/exception.form';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { successForm } from '../example/form/success.form';
import { CREATE_DRAWER_DATA } from '../example/data/drawer';
import { CreateDrawerResponse } from 'src/drawer/dto/create-drawer.dto';

export function CreateDrawerDocs() {
  return applyDecorators(
    ApiTags('Drawer'),
    ApiOperation({
      summary: 'Drawer Create API',
      description: '유저가 찜박스를 생성합니다',
    }),
    ApiConflictResponse({
      description: '중복된 찜박스 이름을 사용한경우',
      example: exceptionForm(
        '/v1/drawer',
        409,
        EXCEPTION_MESSAGE.DRAWER.DUPLICATE_NAME,
      ),
    }),
    ApiBadRequestResponse({
      description: '입력 필드 타입이 잘 못 들어온 경우',
      example: exceptionForm('/v1/drawer', 400, 'name must be a string'),
    }),
    ApiCreatedResponse({
      description: '찜박스 생성',
      example: successForm('/v1/auth/signup', 201, CREATE_DRAWER_DATA),
      type: CreateDrawerResponse,
    }),
  );
}

export function DeleteDrawerDocs() {
  return applyDecorators(
    ApiTags('Drawer'),
    ApiOperation({
      summary: 'Drawer Delete API',
      description: '유저가 "자신의" 찜박스를 삭제합니다',
    }),
    ApiNotFoundResponse({
      description: '유저가 찾은 id의 찜박스가 존재하지 않을 때',
      example: exceptionForm(
        '/v1/drawer/{drawerId}',
        404,
        EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND,
      ),
    }),
    ApiForbiddenResponse({
      description: '유저가 자신의 것이 아닌 찜박스를 삭제하려고 할 때',
      example: exceptionForm(
        '/v1/drawer/{drawerId}',
        403,
        EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER,
      ),
    }),
    ApiOkResponse({
      description: '찜박스 삭제 완료',
      example: successForm('/v1/auth/signup', 200, 'OK'),
      schema: {
        type: 'string',
        example: 'OK',
      },
    }),
  );
}
