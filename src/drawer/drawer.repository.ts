import { Inject, Injectable } from '@nestjs/common';
import { Drawer } from 'src/entities';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { SaveDrawerDto } from './dto/save-drawer.dto';
import { GetMyDrawerByNameDto } from './dto/get-my-drawer-by-name.dto';
import { CursorSearchQuery } from 'src/common/dto/search-query.dto';

@Injectable()
export class DrawerRepository {
  constructor(
    @Inject('DRAWER_REPOSITORY')
    private readonly drawerRepository: Repository<Drawer>,
  ) {}

  /**
   *
   * @param saveDrawerDto 찜박스를 생성하기 위한 찜 박스 이름과 유저 Unique Key
   * @returns 찜박스
   */
  async saveDrawer(saveDrawerDto: SaveDrawerDto): Promise<Drawer> {
    return await this.drawerRepository.save({
      name: saveDrawerDto.name,
      thumbnails: [],
      user_id: saveDrawerDto.userId,
    });
  }

  /**
   *
   * @param userId User Unique Key
   * @param cursorSearchQuery Cursor Search Query
   * @returns
   */
  async getMyDrawerListWithPagination(
    userId: number,
    cursorSearchQuery: CursorSearchQuery,
  ): Promise<Drawer[]> {
    return await this.drawerRepository.find({
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

  /**
   *
   * @param getMyDrawerByNameDto 나의 찜박스를 이름을 찾습니다
   * @returns 찜박스 혹은 null
   */
  async getMyDrawerByName(
    getMyDrawerByNameDto: GetMyDrawerByNameDto,
  ): Promise<Drawer> {
    return await this.drawerRepository.findOne({
      where: {
        name: getMyDrawerByNameDto.name,
        user_id: getMyDrawerByNameDto.user_id,
      },
    });
  }

  /**
   *
   * @param drawerId Drawer Unique Key
   * @returns Drawer
   */
  async getDrawerById(drawerId: number): Promise<Drawer> {
    return await this.drawerRepository.findOne({ where: { id: drawerId } });
  }

  /**
   *
   * @param drawerId 박스 Unique Key≈
   * @param entityManager query runner in typeorm
   * @returns drawer | null
   */
  async getDrawerByIdWithTransaction(
    drawerId: number,
    entityManager: EntityManager,
  ): Promise<Drawer> {
    return await entityManager.findOne(Drawer, {
      where: { id: drawerId },
    });
  }

  /**
   *
   * @param drawerId Drawer Unique Key
   * @param thumbnails Drawer Thumbnail Image
   * @param entityManager query runner in typeorm
   */
  async updateDrawerThumbnailsWithTransaction(
    drawerId: number,
    thumbnails: string[],
    entityManager: EntityManager,
  ): Promise<void> {
    await entityManager.update(
      Drawer,
      { id: drawerId },
      { thumbnails: thumbnails },
    );
  }

  /**
   *
   * @param drawerId Drawer Unique Key
   * @param entityManager query runner in typeorm
   */
  async incrementDrawerZzimCountWithTransaction(
    drawerId: number,
    entityManaer: EntityManager,
  ): Promise<void> {
    await entityManaer.increment(Drawer, { id: drawerId }, 'zzim_count', 1);
  }

  /**
   *
   * @param userId
   * @param drawerId
   * @returns
   */
  async decreseDrawerZzimCountWithTransaction(
    drawerId: number,
    manager: EntityManager,
  ): Promise<void> {
    await manager.decrement(Drawer, { id: drawerId }, 'zzim_count', 1);
  }

  /**
   *
   * @param drawerId Drawer Unique Key
   * @param entityManager query runner in typeorm
   */
  async deleteDrawerWithTransaction(
    drawerId: number,
    entityManager: EntityManager,
  ): Promise<void> {
    await entityManager.delete(Drawer, { id: drawerId });
  }
}
