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

  async getMyZzimItemListByDrawerId(
    drawerId: number,
    userId: number,
  ): Promise<ZzimItem[]> {
    return await this.zzimItemRepository.find({
      where: { drawer_id: drawerId, user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async deleteMyZzimItem(userId: number, productId: number) {
    await this.zzimItemRepository.delete({
      user_id: userId,
      product_id: productId,
    });
    return 'OK';
  }
}
