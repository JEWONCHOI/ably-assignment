import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './providers/product.provider';
import { ProductRepository } from './product.repository';

@Module({
  imports: [DatabaseModule],
  providers: [...productProviders, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
