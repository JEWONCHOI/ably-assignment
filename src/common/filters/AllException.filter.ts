import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : exception;

    let messages: string[] = [];

    if (typeof exceptionResponse === 'string') {
      messages = [exceptionResponse];
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const msg = (exceptionResponse as any).message;
      messages = Array.isArray(msg) ? msg : [msg];
    } else {
      messages = ['Unexpected error occurred'];
    }

    const log = {
      status: httpStatus,
      timestamp: new Date().toISOString(),
      url: request.url,
      message: messages,
    };

    Logger.log(log);

    response.status(httpStatus).json(log);
  }
}
