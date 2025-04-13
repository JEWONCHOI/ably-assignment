import { Inject, Injectable } from '@nestjs/common';
import { Zzim } from 'src/entities/zzim.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ZzimRepository {
  constructor(
    @Inject('ZZIM_REPOSITORY')
    private readonly zzimRepository: Repository<Zzim>,
  ) {}

  /**
   *
   * @param userId User Unique Key
   * @param productId Product Unique Key
   * @returns Zzim
   */
  async getMyZzimItem(userId: number, productId: number): Promise<Zzim> {
    return await this.zzimRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });
  }

  /**
   *
   * @param zzimId Zzim Unique Key
   * @returns Zzim
   */
  async getZzimById(zzimId: number): Promise<Zzim> {
    return await this.zzimRepository.findOne({
      where: { id: zzimId },
    });
  }

  /**
   *
   * @param userId User Unique key
   * @param drawerId Drawer Unique Key
   * @param productId Product Unique Key
   * @returns Zzim
   */
  async saveZzim(
    userId: number,
    drawerId: number,
    productId: number,
  ): Promise<Zzim> {
    return await this.zzimRepository.save({
      user_id: userId,
      drawer_id: drawerId,
      product_id: productId,
    });
  }

  async deleteZzim(userId: number, zzimId: number): Promise<string> {
    await this.zzimRepository.delete({ user_id: userId, id: zzimId });
    return 'OK';
  }
}
