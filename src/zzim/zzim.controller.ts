import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { CreateZzimDto } from './dto/create-zzim.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Zzim } from 'src/entities/zzim.entity';

@UseGuards(AuthGuard)
@Controller('zzim')
export class ZzimController {
  constructor(private readonly zzimService: ZzimService) {}

  @Post(':productId')
  async createZzim(
    @Req() req: Request,
    @Param('productId') productId: number,
    @Body() createZzimDto: CreateZzimDto,
  ): Promise<Zzim> {
    return await this.zzimService.createZzim(
      req.user.id,
      productId,
      createZzimDto,
    );
  }
}
