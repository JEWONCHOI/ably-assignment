import { Inject, Injectable } from '@nestjs/common';
import { Zzim } from 'src/entities/zzim.entity';
import { LessThan, Repository } from 'typeorm';
import { SaveZzimDto } from './providers/save-zzim.dto';
import { CursorSearchQuery } from 'src/common/dto/search-query.dto';

@Injectable()
export class ZzimRepository {
  constructor(
    @Inject('ZZIM_REPOSITORY')
    private readonly zzimRepository: Repository<Zzim>,
  ) {}

  /**
   *
   * @param userId User Unique Key
   * @param productId Product Unique Key
   * @returns Zzim
   */
  async getMyZzimItem(userId: number, productId: number): Promise<Zzim> {
    return await this.zzimRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });
  }

  /**
   *
   * @param zzimId Zzim Unique Key
   * @returns Zzim
   */
  async getZzimById(zzimId: number): Promise<Zzim> {
    return await this.zzimRepository.findOne({
      where: { id: zzimId },
    });
  }

  async getZzimByDrawerId(drawerId: number, userId: number): Promise<Zzim[]> {
    return await this.zzimRepository.find({
      where: { drawer_id: drawerId, user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async getMyZzimListWithPagination(
    userId: number,
    cursorSearchQuery: CursorSearchQuery,
  ) {
    return await this.zzimRepository.find({
      where: {
        id: cursorSearchQuery.cursor
          ? LessThan(cursorSearchQuery.cursor)
          : undefined,
        user_id: userId,
      },
      order: { created_at: 'DESC' },
      take: cursorSearchQuery.size + 1,
    });
  }

  async getMyZzimWithPaginationById(
    drawerId: number,
    cursor: number,
    size: number,
  ): Promise<Zzim[]> {
    return await this.zzimRepository.find({
      where: {
        id: cursor ? LessThan(cursor) : undefined,
        drawer_id: drawerId,
      },
      order: { created_at: 'DESC' },
      take: size + 1,
    });
  }

  /**
   *
   * @param saveZzimDto zzim 객체
   * @returns zzim
   */
  async saveZzim(saveZzimDto: SaveZzimDto): Promise<Zzim> {
    return await this.zzimRepository.save(saveZzimDto);
  }

  async deleteZzim(userId: number, zzimId: number): Promise<string> {
    await this.zzimRepository.delete({ user_id: userId, id: zzimId });
    return 'OK';
  }
}
