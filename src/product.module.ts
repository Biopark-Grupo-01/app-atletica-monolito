import { Module } from '@nestjs/common';
import { ProductController } from './interfaces/controllers/product.controller';
import { ProductService } from './application/services/product.service';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { ProductInMemoryRepository } from './infrastructure/repositories/product-in-memory.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductInMemoryRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}