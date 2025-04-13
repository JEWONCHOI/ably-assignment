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
  GetMyDrawerZzimListDocs,
} from 'src/docs/decorators/drawer.decorator';
import {
  CursorSearchQuery,
  SearchQuery,
} from 'src/common/dto/search-query.dto';
import { ZzimItemResponseDto } from 'src/zzim/dto/zzim.dto';
import { GetDrawerWithZzimsResponse } from './dto/get-my-drawer-zzim-list.dto';

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

  @GetMyDrawerZzimListDocs()
  @Get(':drawerId/zzim')
  async getMyDrawerZzimList(
    @Req() req: Request,
    @Param('drawerId') drawerId: number,
    @Query() cursorSearchQuery: CursorSearchQuery,
  ): Promise<GetDrawerWithZzimsResponse<ZzimItemResponseDto>> {
    return await this.drawerService.getMyDrawerZzimLits(
      req.user.id,
      drawerId,
      cursorSearchQuery,
    );
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
