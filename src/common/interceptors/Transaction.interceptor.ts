import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const request = context.switchToHttp().getRequest();
    request.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      mergeMap((result) =>
        from(
          (async () => {
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return result;
          })(),
        ),
      ),
      catchError((err) =>
        from(
          (async () => {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();

            if (err instanceof HttpException) {
              return throwError(
                () => new HttpException(err.getResponse(), err.getStatus()),
              );
            }

            return throwError(() => err);
          })(),
        ).pipe(mergeMap((e) => e)),
      ),
    );
  }
}
