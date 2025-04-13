import { Inject, Injectable } from '@nestjs/common';
import { ZzimItem } from 'src/entities/zzim-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ZzimItemRepository {
  constructor(
    @Inject('ZZIM_ITEM_REPOSITORY')
    private readonly zzimItemRepository: Repository<ZzimItem>,
  ) {}
}
