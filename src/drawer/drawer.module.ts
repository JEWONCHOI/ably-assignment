import { Module } from '@nestjs/common';
import { DrawerService } from './drawer.service';
import { DrawerController } from './drawer.controller';

@Module({
  controllers: [DrawerController],
  providers: [DrawerService],
})
export class DrawerModule {}
