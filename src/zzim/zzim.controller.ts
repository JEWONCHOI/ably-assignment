import { Controller } from '@nestjs/common';
import { ZzimService } from './zzim.service';

@Controller('zzim')
export class ZzimController {
  constructor(private readonly zzimService: ZzimService) {}
}
