import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { exceptionForm } from '../example/form/exception.form';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { successForm } from '../example/form/success.form';
import { SIGNUP_RESPONSE } from '../example/data/auth';
import { SignupResponse } from 'src/auth/dto/signup.dto';
import { SigninResponse } from 'src/auth/dto/signin.dto';

export function SignupDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'User Signup API',
      description: '유저가 회원가입을 진행합니다',
    }),
    ApiConflictResponse({
      description: '중복된 회원 이메일을 사용한 경우',
      example: exceptionForm(
        '/v1/auth/signup',
        409,
        EXCEPTION_MESSAGE.USER.DUPLICATE_EMAIL,
      ),
    }),
    ApiBadRequestResponse({
      description: '입력 필드 타입이 잘 못 들어온 경우',
      example: exceptionForm('/v1/auth/signup', 400, [
        'email must be an email',
        'password must be a string',
        'name must be a string',
      ]),
    }),
    ApiCreatedResponse({
      description: '유저 생성',
      example: successForm('/v1/auth/signup', 201, SIGNUP_RESPONSE),
      type: SignupResponse,
    }),
  );
}

export function SigninDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'User Login API',
      description: '유저가 로그인을 진행합니다',
    }),
    ApiUnauthorizedResponse({
      description: '비밀번호 혹은 이메일이 틀린 경우',
      example: exceptionForm(
        '/v1/auth/signin',
        401,
        EXCEPTION_MESSAGE.USER.INVALID_EMAIL_OR_PASSWORD,
      ),
    }),
    ApiBadRequestResponse({
      description: '입력 필드 타입이 잘 못 들어온 경우',
      example: exceptionForm('/v1/auth/signup', 400, [
        'email must be an email',
        'password must be a string',
      ]),
    }),
    ApiCreatedResponse({
      description: '로그인 성공',
      example: successForm(
        '/v1/auth/signin',
        201,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      ),
      type: SigninResponse,
    }),
  );
}
