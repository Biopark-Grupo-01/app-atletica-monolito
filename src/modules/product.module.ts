import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../presentation/controllers/product.controller';
import { ProductService } from '../application/services/product.service';
import { TypeOrmProductRepository } from '../infrastructure/typeorm/repositories/typeorm-product.repository';
import { PRODUCT_REPOSITORY_TOKEN } from '../domain/repositories/product.repository.interface';
import { Product } from '../domain/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: [ProductService, PRODUCT_REPOSITORY_TOKEN],
})
export class ProductModule {}
