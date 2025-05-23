import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductPostgresRepository implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }

  async create(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async update(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    await this.productRepository.update(id, productData);
    return this.findById(id);
  }

  async delete(
    id: string,
  ): Promise<{ success: boolean; product: Product | null }> {
    try {
      // Buscar o produto antes de deletar
      const product = await this.findById(id);

      if (!product) {
        return { success: false, product: null };
      }

      const result = await this.productRepository.delete(id);

      // Verificar se o resultado tem a propriedade affected ou raw
      let success = false;
      if (result && typeof result === 'object') {
        if ('affected' in result && result.affected !== undefined) {
          // Verificar se result.affected não é nulo antes de usar
          success = result.affected !== null && result.affected > 0;
        }
        if ('raw' in result && result.raw !== undefined) {
          success = result.raw.affectedRows > 0;
        }
      }

      return {
        success,
        product,
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, product: null };
    }
  }
}
