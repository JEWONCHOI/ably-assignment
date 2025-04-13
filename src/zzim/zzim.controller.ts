import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ZzimService } from './zzim.service';
import { CreateZzimDto } from './dto/create-zzim.dto';
import { Request } from 'express';

@Controller('zzim')
export class ZzimController {
  constructor(private readonly zzimService: ZzimService) {}

  @Post(':productId')
  async createZzim(
    @Req() req: Request,
    @Param('productid') productId: number,
    @Body() createZzimDto: CreateZzimDto,
  ) {
    return await this.zzimService.createZzim(
      req.user.id,
      productId,
      createZzimDto,
    );
  }
}
