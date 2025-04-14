import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   *
   * id를 기준으로 상품을 검색합니다
   *
   * @param id 상품 Primary Key
   * @returns 상품 객체 혹은 null(일치하는 아이디가 없는 경우)
   */
  async gerProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  /**
   *
   * id를 기준으로 상품을 검색합니다
   *
   * @param id 상품 Primary Key
   * @returns 상품 객체 혹은 null(일치하는 아이디가 없는 경우)
   */
  async gerProductByIdWithTransaction(
    id: number,
    entityManager: EntityManager,
  ): Promise<Product | null> {
    return await entityManager.findOne(Product, {
      where: { id: id },
    });
  }
}
