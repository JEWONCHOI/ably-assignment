import { zzimItemProviders } from './../zzim-item/providers/zzim-item.provider';
import { ZzimItemRepository } from './../zzim-item/zzim-item.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { ZzimRepository } from './zzim.repository';
import { CreateZzimDto, CreateZzimResponse } from './dto/create-zzim.dto';
import { ProductRepository } from 'src/product/product.repository';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { DrawerRepository } from 'src/drawer/drawer.repository';
import { Zzim } from 'src/entities/zzim.entity';

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
  ): Promise<CreateZzimResponse> {
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

    const exisitingDrawer = await this.drawerRepository.getDrawerById(
      createZzimDto.drawer_id,
    );

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
    const [_, __, zzim, ___] = await Promise.all([
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
      this.zzimRepository.saveZzim(
        userId,
        createZzimDto.drawer_id,
        existingProduct.id,
      ),
      // save zzim item
      this.zzimItemRepository.saveMyZzimItem({
        product_id: existingProduct.id,
        name: existingProduct.name,
        price: existingProduct.price,
        thumbnail: existingProduct.thumbnail,
        user_id: userId,
        drawer_id: createZzimDto.drawer_id,
      }),
    ]);

    return {
      id: zzim.id,
      drawer_id: zzim.drawer_id,
      product_id: zzim.product_id,
      user_id: zzim.user_id,
    };
  }

  async deleteZzim(userId: number, zzimId: number): Promise<string> {
    const existingZzim = await this.zzimRepository.getZzimById(zzimId);

    if (!existingZzim) {
      throw new HttpException(EXCEPTION_MESSAGE.ZZIM.NOT_FOUND_ZZIM, 404);
    }

    if (existingZzim.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.ZZIM.NOT_MY_ZZIM, 403);
    }

    const thumbnails = await this.calculateThumbnailImageWhenDeleteZzim(
      existingZzim,
      userId,
    );

    await Promise.all([
      this.zzimRepository.deleteZzim(userId, zzimId),
      this.zzimItemRepository.deleteMyZzimItem(userId, existingZzim.product_id),
      this.drawerRepository.decreseDrawerZzimCount(
        userId,
        existingZzim.drawer_id,
      ),
      this.drawerRepository.updateDrawerThumbnails(
        userId,
        existingZzim.drawer_id,
        thumbnails,
      ),
    ]);

    return 'OK';
  }

  private async calculateThumbnailImageWhenDeleteZzim(
    zzim: Zzim,
    userId: number,
  ): Promise<string[]> {
    const zzimItems = await this.zzimItemRepository.getMyZzimItemListByDrawerId(
      zzim.drawer_id,
      userId,
    );

    const remainingItems = zzimItems.filter(
      (item) => item.product_id !== zzim.product_id,
    );

    const thumbnails = remainingItems
      .slice(0, this.MAX_DRAWER_THUMBNAIL_LENGTH)
      .map((item) => item.thumbnail);

    return thumbnails;
  }
}
