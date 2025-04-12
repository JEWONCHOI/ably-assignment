import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
  GetDrawerDocs,
} from 'src/docs/decorators/drawer.decorator';
import { SearchQuery } from 'src/common/dto/search-query.dto';

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

  @GetDrawerDocs()
  @Get()
  async getMyDrawerList(
    @Req() req: Request,
    @Query() searchQuery: SearchQuery,
  ) {
    return await this.drawerService.getMyDrawerList(req.user.id, searchQuery);
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
