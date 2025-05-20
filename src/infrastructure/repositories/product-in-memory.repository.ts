import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductInMemoryRepository implements ProductRepository {
  private products: Product[] = [];

  async findAll(): Promise<Product[]> {
    // Clone products properly preserving methods
    return this.products.map(product => new Product({...product}));
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product ? new Product({...product}) : null;
  }

  async create(product: Product): Promise<Product> {
    // Ensure product is a proper instance with methods
    const newProduct = new Product({...product});
    this.products.push(newProduct);
    return new Product({...newProduct});
  }

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }

    // Create a new product instance with updated data
    const updatedProduct = new Product({
      ...this.products[index],
      ...productData,
      updatedAt: new Date(),
    });

    this.products[index] = updatedProduct;
    return new Product({...updatedProduct});
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return initialLength !== this.products.length;
  }
}