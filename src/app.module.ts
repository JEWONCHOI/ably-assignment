import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validation } from './common/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : process.env.NODE_ENV === 'development'
            ? '.development.env'
            : '.env',
      isGlobal: true,
      validationSchema: validation,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
