import { Module } from '@nestjs/common';
import { zzimItemProviders } from './providers/zzim-item.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ZzimItemRepository } from './zzim-item.repository';

@Module({
  imports: [DatabaseModule],
  providers: [...zzimItemProviders, ZzimItemRepository, ZzimItemRepository],
  exports: [ZzimItemRepository],
})
export class ZzimItemModule {}
