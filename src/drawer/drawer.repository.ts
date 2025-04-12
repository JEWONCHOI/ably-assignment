import { Inject, Injectable } from '@nestjs/common';
import { Drawer } from 'src/entities';
import { Repository } from 'typeorm';
import { SaveDrawerDto } from './dto/save-drawer.dto';
import { GetMyDrawerByNameDto } from './dto/get-my-drawer-by-name.dto';

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
   * @param drawerId 박스 Unique Key
   * @returns drawer | null
   */
  async getDrawerById(drawerId: number): Promise<Drawer> {
    return await this.drawerRepository.findOne({
      where: { id: drawerId },
    });
  }

  /**
   *
   * @param drawerId 박스 Unique Key
   * @param userId 유저 Unique KEy
   */
  async deleteMyDrawer(drawerId: number, userId: number): Promise<void> {
    await this.drawerRepository.delete({ id: drawerId, user_id: userId });
  }
}
