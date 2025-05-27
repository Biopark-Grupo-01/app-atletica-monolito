import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dtos/product.dto';

export const PRODUCT_REPOSITORY_TOKEN = Symbol('ProductRepository'); // Changed to Symbol

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(createProductDto: CreateProductDto): Promise<Product>; // Use DTO for creation
  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null>; // Use DTO for update
  delete(id: string): Promise<boolean>; // Simplified delete to return boolean
}
