import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { CreateZzimDto, CreateZzimResponse } from './dto/create-zzim.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Zzim } from 'src/entities/zzim.entity';
import {
  CreateZzimDocs,
  DeleteZzimDos,
} from 'src/docs/decorators/zzim.decorator';

@UseGuards(AuthGuard)
@Controller('zzim')
export class ZzimController {
  constructor(private readonly zzimService: ZzimService) {}

  @DeleteZzimDos()
  @Delete(':zzimId')
  async deleteZzim(
    @Req() req: Request,
    @Param('zzimId') zzimId: number,
  ): Promise<string> {
    return await this.zzimService.deleteZzim(req.user.id, zzimId);
  }
}
