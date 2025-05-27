import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dtos/product.dto';

export const PRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(createProductDto: CreateProductDto): Promise<Product>;
  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
