import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductPostgresRepository implements ProductRepository {
  private readonly logger = new Logger(ProductPostgresRepository.name);

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
      this.logger.log(`Attempting to delete product with ID: ${id}`);

      if (!product) {
        this.logger.warn(`Product with ID ${id} not found for deletion`);
        return { success: false, product: null };
      }

      this.logger.log(`Found product to delete: ${JSON.stringify(product)}`);

      // Usar o método remove em vez de delete para garantir que os eventos de ciclo de vida sejam acionados
      await this.productRepository.remove(product);

      // Verificar se o produto foi realmente excluído
      const checkIfDeleted = await this.findById(id);
      const success = checkIfDeleted === null;

      this.logger.log(`Deletion success: ${success}`);

      return {
        success,
        product,
      };
    } catch (error) {
      this.logger.error(`Error deleting product: ${error.message}`, error.stack);
      return { success: false, product: null };
    }
  }
}
