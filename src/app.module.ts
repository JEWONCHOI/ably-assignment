import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validation } from './common/utils';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { DrawerModule } from './drawer/drawer.module';

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
    AuthModule,
    TokenModule,
    UserModule,
    ProductModule,
    DrawerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
