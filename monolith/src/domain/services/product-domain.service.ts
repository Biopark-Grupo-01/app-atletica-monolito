import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductCategory } from '../entities/product-category.entity';
import {
  ProductInStockSpecification,
  ProductLowStockSpecification,
  ProductByCategorySpecification,
  ProductPriceRangeSpecification,
  ProductAvailableForSaleSpecification,
} from '../specifications/product.specifications';

@Injectable()
export class ProductDomainService {
  private readonly lowStockThreshold = 5;

  canReduceStock(product: Product, quantity: number): boolean {
    return product.canReduceStock(quantity);
  }

  reduceStockWithBusinessRules(product: Product, quantity: number): void {
    if (!this.canReduceStock(product, quantity)) {
      throw new Error(
        `Cannot reduce stock. Insufficient quantity. Current: ${product.stock}, Requested: ${quantity}`,
      );
    }

    // Delegate to entity method which handles domain events
    product.reduceStock(quantity);
  }

  addStockWithBusinessRules(product: Product, quantity: number): void {
    // Delegate to entity method which handles domain events
    product.addStock(quantity);
  }

  getProductsRequiringAttention(products: Product[]): {
    outOfStock: Product[];
    lowStock: Product[];
  } {
    const outOfStockSpec = new ProductInStockSpecification().not();
    const lowStockSpec = new ProductLowStockSpecification(
      this.lowStockThreshold,
    );

    return {
      outOfStock: products.filter((product) =>
        outOfStockSpec.isSatisfiedBy(product),
      ),
      lowStock: products.filter(
        (product) =>
          lowStockSpec.isSatisfiedBy(product) &&
          !outOfStockSpec.isSatisfiedBy(product),
      ),
    };
  }

  getProductsByCategory(products: Product[], categoryId: string): Product[] {
    const categorySpec = new ProductByCategorySpecification(categoryId);
    return products.filter((product) => categorySpec.isSatisfiedBy(product));
  }

  getProductsInPriceRange(
    products: Product[],
    minPrice: number,
    maxPrice: number,
  ): Product[] {
    const priceRangeSpec = new ProductPriceRangeSpecification(
      minPrice,
      maxPrice,
    );
    return products.filter((product) => priceRangeSpec.isSatisfiedBy(product));
  }

  getAvailableProductsForSale(products: Product[]): Product[] {
    const availableSpec = new ProductAvailableForSaleSpecification();
    return products.filter((product) => availableSpec.isSatisfiedBy(product));
  }

  calculateCategoryInventoryValue(
    products: Product[],
    category: ProductCategory,
  ): number {
    const categoryProducts = this.getProductsByCategory(products, category.id);
    return categoryProducts.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    );
  }

  recommendRestockQuantity(product: Product): number {
    if (product.isOutOfStock()) {
      return 20; // Base restock quantity
    }

    if (product.isLowStock(this.lowStockThreshold)) {
      return 15 - product.stock; // Restock to 15 units
    }

    return 0; // No restock needed
  }
}
