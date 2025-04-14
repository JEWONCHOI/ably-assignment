import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateZzimDocs } from 'src/docs/decorators/zzim.decorator';
import {
  CreateZzimDto,
  CreateZzimResponse,
} from 'src/zzim/dto/create-zzim.dto';
import { ZzimService } from 'src/zzim/zzim.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly zzimService: ZzimService) {}

  @CreateZzimDocs()
  @Post(':productId/zzim')
  async createZzim(
    @Req() req: Request,
    @Param('productId') productId: number,
    @Body() createZzimDto: CreateZzimDto,
  ): Promise<CreateZzimResponse> {
    return this.zzimService.createZzim(req.user.id, productId, createZzimDto);
  }
}
