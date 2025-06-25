import { ProductCategory } from '../entities/product-category.entity';

export const PRODUCT_CATEGORY_REPOSITORY_TOKEN = Symbol(
  'IProductCategoryRepository',
);

export interface IProductCategoryRepository {
  create(category: ProductCategory): Promise<ProductCategory>;
  findAll(): Promise<ProductCategory[]>;
  findById(id: string): Promise<ProductCategory | null>;
  findByName(name: string): Promise<ProductCategory | null>;
  update(
    id: string,
    category: Partial<ProductCategory>,
  ): Promise<ProductCategory | null>;
  delete(id: string): Promise<void>;
}
