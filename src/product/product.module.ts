import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './providers/product.provider';
import { ProductRepository } from './product.repository';
import { ProductController } from './product.controller';
import { ZzimModule } from 'src/zzim/zzim.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => ZzimModule), TokenModule],
  providers: [...productProviders, ProductRepository],
  exports: [ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
