import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './interfaces/controllers/product.controller';
import { ProductService } from './application/services/product.service';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { ProductPostgresRepository } from './infrastructure/repositories/product-postgres.repository';
import { Product } from './domain/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPostgresRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
