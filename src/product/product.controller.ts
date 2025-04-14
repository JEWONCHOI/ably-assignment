import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { TransactionManager } from 'src/common/decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { TransactionInterceptor } from 'src/common/interceptors';
import { CreateZzimDocs } from 'src/docs/decorators/zzim.decorator';
import {
  CreateZzimDto,
  CreateZzimResponse,
} from 'src/zzim/dto/create-zzim.dto';
import { ZzimService } from 'src/zzim/zzim.service';
import { EntityManager } from 'typeorm';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly zzimService: ZzimService) {}

  @CreateZzimDocs()
  @UseInterceptors(TransactionInterceptor)
  @Post(':productId/zzim')
  async createZzim(
    @Req() req: Request,
    @Param('productId') productId: number,
    @Body() createZzimDto: CreateZzimDto,
    @TransactionManager() transactionManger: EntityManager,
  ): Promise<CreateZzimResponse> {
    return this.zzimService.createZzim(
      req.user.id,
      productId,
      createZzimDto,
      transactionManger,
    );
  }
}
