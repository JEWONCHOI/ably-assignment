import { Module } from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { ZzimController } from './zzim.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { zzimProviders } from './providers/zzim.provider';
import { ZzimRepository } from './zzim.repository';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [ZzimController],
  providers: [...zzimProviders, ZzimRepository, ZzimService],
})
export class ZzimModule {}
