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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { exceptionForm } from '../example/form/exception.form';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { successForm } from '../example/form/success.form';
import {
  CREATE_DRAWER_DATA,
  GET_MY_DRAWER_LIST_DATA,
  GET_MY_DRAWER_ZZIM_LIST_DATA,
} from '../example/data/drawer';
import { CreateDrawerResponse } from 'src/drawer/dto/create-drawer.dto';
import { DrawerListPaginationResponse } from 'src/drawer/dto/get-my-drawer-list.dto';

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
      example: successForm('/v1/drawer', 201, CREATE_DRAWER_DATA),
      type: CreateDrawerResponse,
    }),
  );
}

export function GetMyDrawerZzimListDocs() {
  return applyDecorators(
    ApiTags('Drawer'),
    ApiOperation({
      summary: 'Drawer Zzim List API',
      description: '유저가 찜박스 안의 찜 아이템 리스트를 수령합니다',
    }),
    ApiNotFoundResponse({
      description: '존재하지 않는 찜박스를 선택한 경우',
      example: exceptionForm(
        `/v1/drawer/1239123/zzim`,
        404,
        EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND,
      ),
    }),
    ApiUnauthorizedResponse({
      description: '자신의 찜박스가 아닌 경우',
      example: exceptionForm(
        `/v1/drawer/1/zzim`,
        403,
        EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER,
      ),
    }),
    ApiBadRequestResponse({
      description: '입력 필드 타입이 잘 못 들어온 경우',
      example: exceptionForm(
        '/v1/drawer',
        400,
        'size must be a number conforming to the specified constraints',
      ),
    }),
    ApiOkResponse({
      description: '찜박스 내부 찜 아이템 조회',
      example: successForm(
        '/v1/drawer/1/zzim',
        201,
        GET_MY_DRAWER_ZZIM_LIST_DATA,
      ),
      type: CreateDrawerResponse,
    }),
  );
}

export function GetDrawerDocs() {
  return applyDecorators(
    ApiTags('Drawer'),
    ApiOperation({
      summary: 'Get Drawer API',
      description: '유저가 "자신의" 찜박스 리스트를 수령합니다',
    }),
    ApiBadRequestResponse({
      description: '필요 쿼리가 존재하지 않는 경우',
      example: exceptionForm('/v1/drawer', 400, [
        'page must be a number conforming to the specified constraints',
        'size must be a number conforming to the specified constraints',
      ]),
    }),
    ApiOkResponse({
      description: '찜박스 리스트 수령 완료',
      example: successForm('/v1/auth/signup', 200, GET_MY_DRAWER_LIST_DATA),
      type: DrawerListPaginationResponse,
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
