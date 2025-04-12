import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DrawerService } from './drawer.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateDrawerDto, CreateDrawerResponse } from './dto/create-drawer.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('drawer')
export class DrawerController {
  constructor(private readonly drawerService: DrawerService) {}

  @Post()
  async createDrawer(
    @Req() req: Request,
    @Body() createDrawerDto: CreateDrawerDto,
  ): Promise<CreateDrawerResponse> {
    return await this.drawerService.createDrawer(req.user.id, createDrawerDto);
  }
}
