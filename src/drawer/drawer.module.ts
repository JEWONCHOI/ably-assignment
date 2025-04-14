import { Module, forwardRef } from '@nestjs/common';
import { DrawerService } from './drawer.service';
import { DrawerController } from './drawer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { drawerProviders } from 'src/drawer/providers/drawer.provider';
import { DrawerRepository } from './drawer.repository';
import { ZzimModule } from 'src/zzim/zzim.module';

@Module({
  imports: [DatabaseModule, TokenModule, forwardRef(() => ZzimModule)],
  controllers: [DrawerController],
  providers: [...drawerProviders, DrawerRepository, DrawerService],
  exports: [DrawerRepository],
})
export class DrawerModule {}
