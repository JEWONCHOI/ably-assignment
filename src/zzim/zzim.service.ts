import { HttpException, Injectable } from '@nestjs/common';
import { ZzimRepository } from './zzim.repository';
import { CreateZzimDto, CreateZzimResponse } from './dto/create-zzim.dto';
import { ProductRepository } from 'src/product/product.repository';
import { EXCEPTION_MESSAGE } from 'src/common/exceptions';
import { DrawerRepository } from 'src/drawer/drawer.repository';
import { Zzim } from 'src/entities/zzim.entity';
import { CursorSearchQuery } from 'src/common/dto/search-query.dto';
import { changeCursorPagiForm } from 'src/common/utils/pagiantaion-from';
import { ChangeCursorPagiFormResponse } from 'src/common/dto/pagination.dto';
import { ZzimItemResponseDto } from './dto/zzim.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class ZzimService {
  private readonly MAX_DRAWER_THUMBNAIL_LENGTH: number;
  constructor(
    private readonly zzimRepository: ZzimRepository,
    private readonly drawerRepository: DrawerRepository,
    private readonly productRepoitory: ProductRepository,
  ) {
    this.MAX_DRAWER_THUMBNAIL_LENGTH = 4;
  }

  async createZzim(
    userId: number,
    productId: number,
    createZzimDto: CreateZzimDto,
    manager: EntityManager,
  ): Promise<CreateZzimResponse> {
    const product = await this.productRepoitory.gerProductByIdWithTransaction(
      productId,
      manager,
    );

    if (!product) {
      throw new HttpException(EXCEPTION_MESSAGE.ITEM.NOT_FOUN_ITEM, 404);
    }

    const existingZzim =
      await this.zzimRepository.getMyZzimItemWithTransactionLock(
        userId,
        productId,
        manager,
      );

    if (existingZzim) {
      throw new HttpException(EXCEPTION_MESSAGE.ZZIM.DUPLICATE_ZZIM_ITEM, 409);
    }

    const drawer = await this.drawerRepository.getDrawerByIdWithTransaction(
      createZzimDto.drawer_id,
      manager,
    );

    if (!drawer) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.DRAWER_NOT_FOUND, 404);
    }

    if (drawer.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.DRAWER.NOT_MY_DRAWER, 403);
    }

    const drawerThumbnailsLengthMatchFour =
      drawer.thumbnails.length === this.MAX_DRAWER_THUMBNAIL_LENGTH;

    const updatedThumbnails = drawerThumbnailsLengthMatchFour
      ? [product.thumbnail, ...drawer.thumbnails.slice(0, 3)]
      : [product.thumbnail, ...drawer.thumbnails];

    await this.drawerRepository.incrementDrawerZzimCountWithTransaction(
      createZzimDto.drawer_id,
      manager,
    );

    await this.drawerRepository.updateDrawerThumbnailsWithTransaction(
      createZzimDto.drawer_id,
      updatedThumbnails,
      manager,
    );

    const zzim = await this.zzimRepository.saveZzimWithTransaction(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        user_id: userId,
        drawer_id: drawer.id,
      },
      manager,
    );

    return {
      id: zzim.id,
      drawer_id: zzim.drawer_id,
      product_id: zzim.product_id,
      user_id: zzim.user_id,
    };
  }

  async getZzimList(
    userId: number,
    cursorSearchQuery: CursorSearchQuery,
  ): Promise<ChangeCursorPagiFormResponse<ZzimItemResponseDto>> {
    const zzimList = await this.zzimRepository.getMyZzimListWithPagination(
      userId,
      cursorSearchQuery,
    );

    return changeCursorPagiForm({
      dataList: zzimList,
      size: cursorSearchQuery.size,
    });
  }

  async deleteZzim(
    userId: number,
    zzimId: number,
    manager: EntityManager,
  ): Promise<string> {
    const existingZzim =
      await this.zzimRepository.getZzimByIdWithTransactionLock(zzimId, manager);

    if (!existingZzim) {
      throw new HttpException(EXCEPTION_MESSAGE.ZZIM.NOT_FOUND_ZZIM, 404);
    }

    if (existingZzim.user_id !== userId) {
      throw new HttpException(EXCEPTION_MESSAGE.ZZIM.NOT_MY_ZZIM, 403);
    }

    const thumbnails = await this.calculateThumbnailImageWhenDeleteZzim(
      existingZzim,
      userId,
      manager,
    );

    await this.zzimRepository.deleteZzimWithTransaction(zzimId, manager);

    await this.drawerRepository.decreseDrawerZzimCountWithTransaction(
      existingZzim.drawer_id,
      manager,
    );

    await this.drawerRepository.updateDrawerThumbnailsWithTransaction(
      existingZzim.drawer_id,
      thumbnails,
      manager,
    );

    return 'OK';
  }

  private async calculateThumbnailImageWhenDeleteZzim(
    zzim: Zzim,
    userId: number,
    entityManager: EntityManager,
  ): Promise<string[]> {
    const zzimItems =
      await this.zzimRepository.getZzimByDrawerIdWithTransaction(
        zzim.drawer_id,
        userId,
        entityManager,
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
