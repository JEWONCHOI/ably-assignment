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
}
