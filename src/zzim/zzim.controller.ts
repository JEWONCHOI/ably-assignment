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
  UseInterceptors,
} from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { CreateZzimDto, CreateZzimResponse } from './dto/create-zzim.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Zzim } from 'src/entities/zzim.entity';
import {
  CreateZzimDocs,
  DeleteZzimDos,
  GetZzimListDocs,
} from 'src/docs/decorators/zzim.decorator';
import { CursorSearchQuery } from 'src/common/dto/search-query.dto';
import { ChangeCursorPagiFormResponse } from 'src/common/dto/pagination.dto';
import { ZzimItemResponseDto } from './dto/zzim.dto';
import { TransactionInterceptor } from 'src/common/interceptors';
import { TransactionManager } from 'src/common/decorator';
import { EntityManager } from 'typeorm';

@UseGuards(AuthGuard)
@Controller('zzim')
export class ZzimController {
  constructor(private readonly zzimService: ZzimService) {}

  @GetZzimListDocs()
  @Get()
  async getZzimList(
    @Req() req: Request,
    @Query() cursorSearchQuery: CursorSearchQuery,
  ): Promise<ChangeCursorPagiFormResponse<ZzimItemResponseDto>> {
    return await this.zzimService.getZzimList(req.user.id, cursorSearchQuery);
  }

  @DeleteZzimDos()
  @UseInterceptors(TransactionInterceptor)
  @Delete(':zzimId')
  async deleteZzim(
    @Req() req: Request,
    @Param('zzimId') zzimId: number,
    @TransactionManager() transactionManger: EntityManager,
  ): Promise<string> {
    return await this.zzimService.deleteZzim(
      req.user.id,
      zzimId,
      transactionManger,
    );
  }
}
