import { Module } from '@nestjs/common';
import { zzimItemProviders } from './providers/zzim-item.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...zzimItemProviders],
})
export class ZzimItemModule {}
