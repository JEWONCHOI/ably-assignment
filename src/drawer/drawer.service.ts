import { HttpException, Injectable } from '@nestjs/common';
import { DrawerRepository } from './drawer.repository';
import { CreateDrawerDto, CreateDrawerResponse } from './dto/create-drawer.dto';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { CursorSearchQuery } from 'src/common/dto/search-query.dto';
import { Drawer } from 'src/entities';
import { ChangeCursorPagiFormResponse } from 'src/common/dto/pagination.dto';
import { changeCursorPagiForm } from 'src/common/utils/pagiantaion-from';
import { ZzimRepository } from 'src/zzim/zzim.repository';
import { GetDrawerWithZzimsResponse } from './dto/get-my-drawer-zzim-list.dto';
import { ZzimItemResponseDto } from 'src/zzim/dto/zzim.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class DrawerService {
  constructor(
    private readonly drawerRepository: DrawerRepository,
    private readonly zzimReposiory: ZzimRepository,
  ) {}

  async createDrawer(
    userId: number,
    createDrawerDto: CreateDrawerDto,
  ): Promise<CreateDrawerResponse> {
    const existingDrawer = await this.drawerRepository.getMyDrawerByName({
      name: createDrawerDto.name,
      user_id: userId,
    });

    if (existingDrawer) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.DUPLICATE_NAME, 409);
    }

    const { id, name, thumbnails } = await this.drawerRepository.saveDrawer({
      name: createDrawerDto.name,
      userId,
    });

    return { id, name, thumbnails };
  }

  async getMyDrawerList(
    userId: number,
    searchQuery: CursorSearchQuery,
  ): Promise<ChangeCursorPagiFormResponse<Drawer>> {
    const drawerList =
      await this.drawerRepository.getMyDrawerListWithPagination(
        userId,
        searchQuery,
      );

    const processThumbnailImage = drawerList.map((drawer) => ({
      ...drawer,
      thumbnails: this.imageLengthMoreThanEqualFour(drawer.thumbnails)
        ? drawer.thumbnails.slice(0, 4)
        : this.imageLengthBetweenOneAndThree(drawer.thumbnails)
          ? drawer.thumbnails.slice(0, 1)
          : [],
    }));

    return changeCursorPagiForm({
      dataList: processThumbnailImage,
      size: searchQuery.size,
    });
  }

  async getMyDrawerZzimLits(
    userId: number,
    drawerId: number,
    cursorSearchQuery: CursorSearchQuery,
  ): Promise<GetDrawerWithZzimsResponse<ZzimItemResponseDto>> {
    const exisitingDrawer = await this.drawerRepository.getDrawerById(drawerId);

    if (!exisitingDrawer) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND, 404);
    }

    if (exisitingDrawer.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER, 403);
    }

    const zzimList = await this.zzimReposiory.getMyZzimWithPaginationById(
      drawerId,
      cursorSearchQuery.cursor,
      cursorSearchQuery.size,
    );

    return {
      drawer: { id: exisitingDrawer.id, name: exisitingDrawer.name },
      zzims: changeCursorPagiForm({
        dataList: zzimList,
        size: cursorSearchQuery.size,
      }),
    };
  }

  async deleteMyDrawer(
    userId: number,
    drawerId: number,
    manager: EntityManager,
  ): Promise<void> {
    const existingDrawer =
      await this.drawerRepository.getDrawerByIdWithTransaction(
        drawerId,
        manager,
      );

    if (!existingDrawer) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND, 404);
    }

    if (existingDrawer.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER, 403);
    }

    await Promise.all([
      this.drawerRepository.deleteDrawerWithTransaction(drawerId, manager),
      this.zzimReposiory.deleteZzimByDrawerIdWithTransaction(drawerId, manager),
    ]);
  }

  private imageLengthMoreThanEqualFour(thumbnail: string[]) {
    return thumbnail.length >= 4;
  }

  private imageLengthBetweenOneAndThree(thumbnail: string[]) {
    return thumbnail.length > 0 && thumbnail.length < 4;
  }
}
