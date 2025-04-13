import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { exceptionForm } from '../example/form/exception.form';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { successForm } from '../example/form/success.form';
import { ApiResponse } from '@nestjs/swagger';
import { CreateZzimResponse } from 'src/zzim/dto/create-zzim.dto';
import { CREATE_ZZIM_RESPONSE_DATA } from '../example/data/zzim';

export function CreateZzimDocs() {
  return applyDecorators(
    ApiTags('Zzim'),
    ApiOperation({
      summary: 'Create zzim API',
      description: '찜을 생성합니다',
    }),
    ApiCreatedResponse({
      description: '찜을 성공적으로 생성합니다',
      type: CreateZzimResponse,
      example: successForm(
        '/v1/product/{productId}/zzim/',
        201,
        CREATE_ZZIM_RESPONSE_DATA,
      ),
    }),
    ApiResponse({
      status: 404,
      description: '',
      content: {
        'application/json': {
          examples: {
            notFoundProduct: {
              summary: '찜을 하려는 상품이 존재하지 않는 경우',
              value: exceptionForm(
                '/v1/product/123891231/zzim/',
                404,
                EXCEPTION_MESSAGE.ITEM.NOT_FOUN_ITEM,
              ),
            },
            notFoundDrawer: {
              summary: '찜을 저장할 상자가 없는 경우',
              value: exceptionForm(
                '/v1/product/1/zzim/',
                404,
                EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND,
              ),
            },
          },
        },
      },
    }),
    ApiConflictResponse({
      description: '찜을 하려는 상품이 이미 내 찜 목록에 있는 경우',
      example: exceptionForm(
        '/v1/zzim/3',
        409,
        EXCEPTION_MESSAGE.ZZIM.DUPLICATE_ZZIM_ITEM,
      ),
    }),
    ApiUnauthorizedResponse({
      description: '찜을 저장하는 찜박스가 내 찜 박스가 아닌 경우',
      example: exceptionForm(
        '/v1/product/12/zzim/',
        409,
        EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER,
      ),
    }),
  );
}

export function DeleteZzimDos() {
  return applyDecorators(
    ApiTags('Zzim'),
    ApiOperation({
      summary: 'Delete Zzim API',
      description: '찜을 제거합니다',
    }),
    ApiOkResponse({
      description: '찜을 성공적으로 제거합니다',
      schema: {
        example: 'OK',
        type: 'string',
        nullable: false,
      },
      example: successForm('/v1/zzim/{zzimId}', 200, 'OK'),
    }),
    ApiNotFoundResponse({
      description: '해당 찜이 존재하지 않는 경우',
      example: exceptionForm(
        '/v1/zzim/3',
        404,
        EXCEPTION_MESSAGE.ZZIM.NOT_FOUND_ZZIM,
      ),
    }),
    ApiUnauthorizedResponse({
      description: '해당 찜이 본인의 것이 아닌 경우',
      example: exceptionForm(
        '/v1/zzim/3',
        409,
        EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER,
      ),
    }),
  );
}
