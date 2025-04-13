import { HttpException, Injectable } from '@nestjs/common';
import { DrawerRepository } from './drawer.repository';
import { CreateDrawerDto, CreateDrawerResponse } from './dto/create-drawer.dto';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import {
  CursorSearchQuery,
  SearchQuery,
} from 'src/common/dto/search-query.dto';
import { Drawer } from 'src/entities';
import { ChangePaginationFormResponse } from 'src/common/dto/pagination.dto';
import {
  changeCursorPagiForm,
  changePaginationForm,
} from 'src/common/utils/pagiantaion-from';
import { ZzimRepository } from 'src/zzim/zzim.repository';
import { GetDrawerWithZzimsResponse } from './dto/get-my-drawer-zzim-list.dto';
import { ZzimItemResponseDto } from 'src/zzim/dto/zzim.dto';

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
    searchQuery: SearchQuery,
  ): Promise<ChangePaginationFormResponse<Drawer[]>> {
    const { drawerList, total } =
      await this.drawerRepository.getMyDrawerListWithSkipAndTake(
        userId,
        searchQuery,
      );

    const processThumbnailImage = drawerList.map((drawer) => ({
      ...drawer,
      thumbnails: this.imageLengthMoreThanFour(drawer.thumbnails)
        ? drawer.thumbnails.slice(0, 4)
        : this.imageLengthLessThanFour(drawer.thumbnails)
          ? drawer.thumbnails.slice(0, 1)
          : [],
    }));

    // 코드 단일화
    return changePaginationForm<Drawer[]>({
      dataName: 'drawerList',
      data: processThumbnailImage,
      totalElement: total,
      take: searchQuery.size,
      page: searchQuery.page,
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

    const zzimList = await this.zzimReposiory.getMyZzzimWithPaginationById(
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

  async deleteMyDrawer(userId: number, drawerId: number): Promise<string> {
    const existingDrawer = await this.drawerRepository.getDrawerById(drawerId);

    if (!existingDrawer) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND, 404);
    }

    if (existingDrawer.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER, 403);
    }

    await this.drawerRepository.deleteMyDrawer(drawerId, userId);

    return 'OK';
  }

  private imageLengthMoreThanFour(thumbnail: string[]) {
    if (thumbnail.length && thumbnail.length > 3) return true;
    else return false;
  }

  private imageLengthLessThanFour(thumbnail: string[]) {
    if (thumbnail.length && thumbnail.length > 4) return true;
    else return false;
  }
}
