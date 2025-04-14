import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { userProviders } from './providers/user.provider';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [AuthController],
  providers: [...userProviders, AuthRepository, AuthService],
})
export class AuthModule {}
