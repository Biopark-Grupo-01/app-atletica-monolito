import { ProductCategory } from '../entities/product-category.entity';
import { CreateProductCategoryDto } from '../../application/dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from '../../application/dtos/update-product-category.dto';

export const PRODUCT_CATEGORY_REPOSITORY_TOKEN = Symbol(
  'IProductCategoryRepository',
);

export interface IProductCategoryRepository {
  create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory>;
  findAll(): Promise<ProductCategory[]>;
  findById(id: string): Promise<ProductCategory | null>;
  findByName(name: string): Promise<ProductCategory | null>;
  update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory | null>;
  delete(id: string): Promise<boolean>;
}
