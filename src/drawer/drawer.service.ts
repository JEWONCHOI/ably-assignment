import { HttpException, Injectable } from '@nestjs/common';
import { DrawerRepository } from './drawer.repository';
import { CreateDrawerDto, CreateDrawerResponse } from './dto/create-drawer.dto';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { SearchQuery } from 'src/common/dto/search-query.dto';
import { Drawer } from 'src/entities';
import { ChangePaginationFormResponse } from 'src/common/dto/pagination.dto';
import { changePaginationForm } from 'src/common/utils/pagiantaion-from';

@Injectable()
export class DrawerService {
  constructor(private readonly drawerRepository: DrawerRepository) {}

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

    return changePaginationForm<Drawer[]>({
      dataName: 'drawerList',
      data: processThumbnailImage,
      totalElement: total,
      take: searchQuery.size,
      page: searchQuery.page,
    });
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
