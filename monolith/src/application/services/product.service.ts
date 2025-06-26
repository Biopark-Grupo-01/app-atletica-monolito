import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_TOKEN,
} from '../../domain/repositories/product.repository.interface';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private productRepository: IProductRepository,
  ) {}

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      categoryId: product.categoryId,
    };
  }

  private mapArrayToResponseDto(products: Product[]): ProductResponseDto[] {
    return products.map((p) => this.mapToResponseDto(p));
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();
    return this.mapArrayToResponseDto(products);
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const newProduct = await this.productRepository.create(createProductDto);
    return this.mapToResponseDto(newProduct);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productRepository.update(
      id,
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found or failed to update.`,
      );
    }
    return this.mapToResponseDto(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    const success = await this.productRepository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `Product with ID ${id} could not be deleted.`,
      );
    }
  }
}
