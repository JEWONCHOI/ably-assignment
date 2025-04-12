import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './providers/product.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...productProviders, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
