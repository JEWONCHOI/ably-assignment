import { Module, forwardRef } from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { ZzimController } from './zzim.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { zzimProviders } from './providers/zzim.provider';
import { ZzimRepository } from './zzim.repository';
import { ProductModule } from 'src/product/product.module';
import { DrawerModule } from 'src/drawer/drawer.module';

@Module({
  imports: [
    forwardRef(() => ProductModule),
    forwardRef(() => DrawerModule),
    DatabaseModule,
    TokenModule,
  ],
  controllers: [ZzimController],
  providers: [...zzimProviders, ZzimRepository, ZzimService],
  exports: [ZzimService, ZzimRepository],
})
export class ZzimModule {}
