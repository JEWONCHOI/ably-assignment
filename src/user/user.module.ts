import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
