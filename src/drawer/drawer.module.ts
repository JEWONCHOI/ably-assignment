import { Module } from '@nestjs/common';
import { DrawerService } from './drawer.service';
import { DrawerController } from './drawer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { drawerProviders } from 'src/drawer/providers/drawer.provider';
import { DrawerRepository } from './drawer.repository';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [DrawerController],
  providers: [...drawerProviders, DrawerRepository, DrawerService],
})
export class DrawerModule {}
