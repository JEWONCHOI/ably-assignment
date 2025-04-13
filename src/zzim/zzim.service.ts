import { zzimItemProviders } from './../zzim-item/providers/zzim-item.provider';
import { ZzimItemRepository } from './../zzim-item/zzim-item.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { ZzimRepository } from './zzim.repository';
import { CreateZzimDto } from './dto/create-zzim.dto';
import { ProductRepository } from 'src/product/product.repository';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { DrawerRepository } from 'src/drawer/drawer.repository';

@Injectable()
export class ZzimService {
  private readonly MAX_DRAWER_THUMBNAIL_LENGTH: number;
  constructor(
    private readonly zzimRepository: ZzimRepository,
    private readonly zzimItemRepository: ZzimItemRepository,
    private readonly drawerRepository: DrawerRepository,
    private readonly productRepoitory: ProductRepository,
  ) {
    this.MAX_DRAWER_THUMBNAIL_LENGTH = 4;
  }

  async createZzim(
    userId: number,
    productId: number,
    createZzimDto: CreateZzimDto,
  ): Promise<string> {
    const existingProduct =
      await this.productRepoitory.gerProductById(productId);

    if (!existingProduct) {
      throw new HttpException(EXCEPTION_MESSAGE.ITEM.NOT_FOUN_ITEM, 404);
    }

    const existingMyZzim = await this.zzimRepository.getMyZzimItem(
      userId,
      productId,
    );

    if (existingMyZzim) {
      throw new HttpException(EXCEPTION_MESSAGE.ZZIM.DUPLICATE_ZZIM_ITEM, 409);
    }

    const exisitingDrawer = await this.drawerRepository.getDrawerById(userId);

    if (!exisitingDrawer) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND, 404);
    }

    if (exisitingDrawer.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER, 403);
    }

    const drawerThumbnailsLengthMatchFour =
      exisitingDrawer.thumbnails.length === this.MAX_DRAWER_THUMBNAIL_LENGTH;

    const setDrawerThumbnailsArray = drawerThumbnailsLengthMatchFour
      ? [existingProduct.thumbnail, ...exisitingDrawer.thumbnails.slice(0, 3)]
      : [existingProduct.thumbnail, ...exisitingDrawer.thumbnails];

    // query 병렬 처리
    await Promise.all([
      // drawer zzim count increment
      this.drawerRepository.incrementDrawerZzimCount(
        userId,
        createZzimDto.drawer_id,
      ),
      // drawer thumbnail set
      this.drawerRepository.updateDrawerThumbnails(
        userId,
        createZzimDto.drawer_id,
        setDrawerThumbnailsArray,
      ),
      // save zzim in drawer
      this.zzimRepository.saveZzim(userId, createZzimDto.drawer_id, productId),
      // save zzim item
      this.zzimItemRepository.saveMyZzimItem({
        product_id: existingProduct.id,
        name: existingProduct.name,
        price: existingProduct.price,
        thumbnail: existingProduct.thumbnail,
        user_id: userId,
      }),
    ]);

    return 'OK';
  }
}
