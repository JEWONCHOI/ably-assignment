import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DrawerService } from './drawer.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateDrawerDto, CreateDrawerResponse } from './dto/create-drawer.dto';
import { Request } from 'express';
import {
  CreateDrawerDocs,
  DeleteDrawerDocs,
} from 'src/docs/decorators/drawer.decorator';

@UseGuards(AuthGuard)
@Controller('drawer')
export class DrawerController {
  constructor(private readonly drawerService: DrawerService) {}

  @CreateDrawerDocs()
  @Post()
  async createDrawer(
    @Req() req: Request,
    @Body() createDrawerDto: CreateDrawerDto,
  ): Promise<CreateDrawerResponse> {
    return await this.drawerService.createDrawer(req.user.id, createDrawerDto);
  }

  @DeleteDrawerDocs()
  @Delete(':drawerId')
  async deleteMyDrawer(
    @Req() req: Request,
    @Param('drawerId') drawerId: number,
  ): Promise<string> {
    return await this.drawerService.deleteMyDrawer(req.user.id, drawerId);
  }
}
