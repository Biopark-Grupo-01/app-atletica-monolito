import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../presentation/controllers/product.controller';
import { ProductService } from '../application/services/product.service';
import { TypeOrmProductRepository } from '../infrastructure/typeorm/repositories/typeorm-product.repository';
import { PRODUCT_REPOSITORY_TOKEN } from '../domain/repositories/product.repository.interface';
import { Product } from '../domain/entities/product.entity';
import { HateoasService } from '../application/services/hateoas.service';
import { TypeOrmProductCategoryRepository } from '../infrastructure/typeorm/repositories/typeorm-product-category.repository';
import { PRODUCT_CATEGORY_REPOSITORY_TOKEN } from '../domain/repositories/product-category.repository.interface';
import { ProductCategory } from '../domain/entities/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory])],
  controllers: [ProductController],
  providers: [
    ProductService,
    HateoasService,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: PRODUCT_CATEGORY_REPOSITORY_TOKEN,
      useClass: TypeOrmProductCategoryRepository,
    },
  ],
  exports: [ProductService, PRODUCT_REPOSITORY_TOKEN],
})
export class ProductModule {}
