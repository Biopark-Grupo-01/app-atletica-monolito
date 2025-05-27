import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../presentation/controllers/product.controller'; // Corrected controller path
import { ProductService } from '../application/services/product.service';
import { PRODUCT_REPOSITORY_TOKEN } from '../domain/repositories/product.repository'; // Corrected token import
import { TypeOrmProductRepository } from '../infrastructure/typeorm/repositories/typeorm-product.repository'; // Corrected repository
import { Product } from '../domain/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
    TypeOrmProductRepository,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: [ProductService, PRODUCT_REPOSITORY_TOKEN],
})
export class ProductModule {}
