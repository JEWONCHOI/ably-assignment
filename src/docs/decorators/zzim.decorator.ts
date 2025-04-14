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
import {
  CREATE_ZZIM_RESPONSE_DATA,
  GET_ZZIM_LIST_DATA,
} from '../example/data/zzim';
import { ChangeCursorPagiFormResponse } from 'src/common/dto/pagination.dto';
import { ZzimItemResponseDto } from 'src/zzim/dto/zzim.dto';

export function CreateZzimDocs() {
  return applyDecorators(
    ApiTags('Product'),
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
                '/v1/product/123891231/zzims/',
                404,
                EXCEPTION_MESSAGE.ITEM.NOT_FOUN_ITEM,
              ),
            },
            notFoundDrawer: {
              summary: '찜을 저장할 상자가 없는 경우',
              value: exceptionForm(
                '/v1/product/1/zzims/',
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
        '/v1/zzims/3',
        409,
        EXCEPTION_MESSAGE.ZZIM.DUPLICATE_ZZIM_ITEM,
      ),
    }),
    ApiUnauthorizedResponse({
      description: '찜을 저장하는 찜박스가 내 찜 박스가 아닌 경우',
      example: exceptionForm(
        '/v1/product/12/zzims/',
        409,
        EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER,
      ),
    }),
  );
}

export function GetZzimListDocs() {
  return applyDecorators(
    ApiTags('Zzim'),
    ApiOperation({
      summary: 'Get Zzim Items API',
      description: '찜한 아이템 목록을 조회합니다',
    }),
    ApiOkResponse({
      description: '찜 아이템 목록을 조회힙니다',
      type: ChangeCursorPagiFormResponse<ZzimItemResponseDto>,
      example: successForm('/v1/zzims', 200, GET_ZZIM_LIST_DATA),
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
      example: successForm('/v1/zzims/{zzimId}', 200, 'OK'),
    }),
    ApiNotFoundResponse({
      description: '해당 찜이 존재하지 않는 경우',
      example: exceptionForm(
        '/v1/zzims/3',
        404,
        EXCEPTION_MESSAGE.ZZIM.NOT_FOUND_ZZIM,
      ),
    }),
    ApiUnauthorizedResponse({
      description: '해당 찜이 본인의 것이 아닌 경우',
      example: exceptionForm(
        '/v1/zzims/3',
        409,
        EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER,
      ),
    }),
  );
}
