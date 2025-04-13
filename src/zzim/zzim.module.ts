import { Module } from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { ZzimController } from './zzim.controller';

@Module({
  controllers: [ZzimController],
  providers: [ZzimService],
})
export class ZzimModule {}
