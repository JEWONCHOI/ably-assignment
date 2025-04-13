import { Inject, Injectable } from '@nestjs/common';
import { ZzimItem } from 'src/entities/zzim-item.entity';
import { Repository } from 'typeorm';
import { SaveMyZzimItemDto } from './dto/save-my-zzim.dto';

@Injectable()
export class ZzimItemRepository {
  constructor(
    @Inject('ZZIM_ITEM_REPOSITORY')
    private readonly zzimItemRepository: Repository<ZzimItem>,
  ) {}

  async saveMyZzimItem(
    saveMyZzimItemDto: SaveMyZzimItemDto,
  ): Promise<ZzimItem> {
    return await this.zzimItemRepository.save(saveMyZzimItemDto);
  }
}
