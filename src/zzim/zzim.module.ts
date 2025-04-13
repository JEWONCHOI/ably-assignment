import { Module } from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { ZzimController } from './zzim.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { zzimProviders } from './providers/zzim.provider';
import { ZzimRepository } from './zzim.repository';
import { ProductModule } from 'src/product/product.module';
import { DrawerModule } from 'src/drawer/drawer.module';
import { ZzimItemModule } from 'src/zzim-item/zzim-item.module';

@Module({
  imports: [
    DatabaseModule,
    TokenModule,
    ProductModule,
    ZzimItemModule,
    DrawerModule,
  ],
  controllers: [ZzimController],
  providers: [...zzimProviders, ZzimRepository, ZzimService],
})
export class ZzimModule {}
