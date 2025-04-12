import { Controller } from '@nestjs/common';
import { DrawerService } from './drawer.service';

@Controller('drawer')
export class DrawerController {
  constructor(private readonly drawerService: DrawerService) {}
}
