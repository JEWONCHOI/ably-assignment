import { applyDecorators } from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { exceptionForm } from '../example/form/exception.form';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { successForm } from '../example/form/success.form';
import { UserInfoResponse } from 'src/user/dto/user-info.dto';

import { ApiResponse } from '@nestjs/swagger';

export function UserInfoDocs() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'User Info Api',
      description: '유저 정보를 제공합니다',
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패 (토큰 관련 오류)',
      content: {
        'application/json': {
          examples: {
            tokenMissing: {
              summary: '토큰이 없는 경우',
              value: exceptionForm(
                '/v1/user/info',
                401,
                EXCEPTION_MESSAGE.AUTH.TOKEN_IS_MISSING,
              ),
            },
            tokenExpired: {
              summary: '토큰이 파기된 경우',
              value: exceptionForm(
                '/v1/user/info',
                401,
                EXCEPTION_MESSAGE.AUTH.TOKEN_EXPIRED,
              ),
            },
            invalidToken: {
              summary: '올바르지 않은 토큰',
              value: exceptionForm(
                '/v1/user/info',
                401,
                EXCEPTION_MESSAGE.AUTH.INVALID_TOKEN,
              ),
            },
          },
        },
      },
    }),
    ApiOkResponse({
      description: '유저 정보를 리턴합니다',
      example: successForm('/v1/user/info', 200, UserInfoResponse),
      type: UserInfoResponse,
    }),
  );
}
