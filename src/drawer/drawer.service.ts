import { HttpException, Injectable } from '@nestjs/common';
import { DrawerRepository } from './drawer.repository';
import { CreateDrawerDto, CreateDrawerResponse } from './dto/create-drawer.dto';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';

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
}
