import { Module } from '@nestjs/common';
import { DrawerService } from './drawer.service';
import { DrawerController } from './drawer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/token/token.module';
import { drawerProviders } from 'src/entities/providers/drawer.provider';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [DrawerController],
  providers: [...drawerProviders, DrawerService],
})
export class DrawerModule {}
