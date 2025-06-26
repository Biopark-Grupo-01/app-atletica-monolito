import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryController } from '../presentation/controllers/product-category.controller';
import { ProductCategoryService } from '../application/services/product-category.service';
import { TypeOrmProductCategoryRepository } from '../infrastructure/typeorm/repositories/typeorm-product-category.repository';
import { PRODUCT_CATEGORY_REPOSITORY_TOKEN } from '../domain/repositories/product-category.repository.interface';
import { ProductCategory } from '../domain/entities/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [
    ProductCategoryService,
    {
      provide: PRODUCT_CATEGORY_REPOSITORY_TOKEN,
      useClass: TypeOrmProductCategoryRepository,
    },
  ],
  exports: [ProductCategoryService, PRODUCT_CATEGORY_REPOSITORY_TOKEN],
})
export class ProductCategoryModule {}
