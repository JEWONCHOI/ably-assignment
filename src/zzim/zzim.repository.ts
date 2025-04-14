import { Inject, Injectable } from '@nestjs/common';
import { Zzim } from 'src/entities/zzim.entity';
import { EntityManager, LessThan, Repository } from 'typeorm';
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
   * @param entityManager query runner in typeorm
   * @returns Zzim
   */
  async getMyZzimItemWithTransactionLock(
    userId: number,
    productId: number,
    entityManager: EntityManager,
  ): Promise<Zzim> {
    return await entityManager
      .createQueryBuilder(Zzim, 'zzim')
      .setLock('pessimistic_write')
      .where('zzim.user_id = :userId', { userId })
      .andWhere('zzim.product_id = :productId', { productId })
      .getOne();
  }

  /**
   *
   * @param zzimId Zzim Unique Key
   * @returns Zzim
   */
  async getZzimByIdWithTransactionLock(
    zzimId: number,
    entityManager: EntityManager,
  ): Promise<Zzim> {
    return await entityManager
      .createQueryBuilder(Zzim, 'zzim')
      .setLock('pessimistic_write')
      .where('zzim.id = :zzimId', { zzimId })
      .getOne();
  }

  async getZzimByDrawerIdWithTransaction(
    drawerId: number,
    userId: number,
    entityManager: EntityManager,
  ): Promise<Zzim[]> {
    return await entityManager.find(Zzim, {
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

  async saveZzimWithTransaction(
    saveZzimDto: SaveZzimDto,
    entityManager: EntityManager,
  ): Promise<Zzim> {
    return await entityManager.save(Zzim, saveZzimDto);
  }

  async deleteZzimWithTransaction(
    zzimId: number,
    entityManger: EntityManager,
  ): Promise<void> {
    await entityManger.delete(Zzim, { id: zzimId });
  }
}
