import { HateoasService } from '@app/application/services/hateoas.service';
import { ProductCategoryService } from '@app/application/services/product-category.service';
import { ProductCategory } from '@app/domain/entities/product-category.entity';
import { PRODUCT_CATEGORY_REPOSITORY_TOKEN } from '@app/domain/repositories/product-category.repository.interface';
import { TypeOrmProductCategoryRepository } from '@app/infrastructure/typeorm/repositories/typeorm-product_category.repository';
import { ProductCategoryController } from '@app/presentation/controllers/product-category.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [
    ProductCategoryService,
    HateoasService,
    {
      provide: PRODUCT_CATEGORY_REPOSITORY_TOKEN,
      useClass: TypeOrmProductCategoryRepository,
    },
  ],
  exports: [ProductCategoryService, PRODUCT_CATEGORY_REPOSITORY_TOKEN],
})
export class ProductCategoryModule {}
