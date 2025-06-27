import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductAggregate } from '../aggregates/product.aggregate';
import { StockQuantity } from '../value-objects/stock-quantity.vo';
import { Money } from '../value-objects/money.vo';
import {
  ProductInStockSpecification,
  ProductLowStockSpecification,
  ProductByCategorySpecification,
  ProductAvailableForSaleSpecification,
} from '../specifications/product.specifications';

@Injectable()
export class InventoryDomainService {
  private readonly lowStockThreshold = 5;

  // Static methods for backward compatibility
  static canReduceStock(product: Product, quantity: number): boolean {
    const stockQuantity = new StockQuantity(product.stock);
    return stockQuantity.canReduce(quantity);
  }

  static calculateTotalValue(products: Product[]): number {
    return products.reduce((total, product) => {
      const price = new Money(product.price);
      const stock = new StockQuantity(product.stock);
      return total + price.amount * stock.value;
    }, 0);
  }

  static isOutOfStock(product: Product): boolean {
    const stockQuantity = new StockQuantity(product.stock);
    return stockQuantity.isOutOfStock();
  }

  static isLowStock(product: Product, threshold: number = 5): boolean {
    const stockQuantity = new StockQuantity(product.stock);
    return stockQuantity.isLowStock(threshold);
  }

  static getAllOutOfStockProducts(products: Product[]): Product[] {
    return products.filter((product) => this.isOutOfStock(product));
  }

  static getAllLowStockProducts(
    products: Product[],
    threshold: number = 5,
  ): Product[] {
    return products.filter((product) => this.isLowStock(product, threshold));
  }

  static calculateInventoryValue(products: Product[]): Money {
    const totalValue = this.calculateTotalValue(products);
    return new Money(totalValue);
  }

  // New instance methods with advanced DDD patterns
  checkStockAvailability(
    product: Product,
    requestedQuantity: number,
  ): {
    isAvailable: boolean;
    availableQuantity: number;
    message: string;
  } {
    const inStockSpec = new ProductInStockSpecification();

    if (!inStockSpec.isSatisfiedBy(product)) {
      return {
        isAvailable: false,
        availableQuantity: 0,
        message: 'Product is out of stock',
      };
    }

    if (product.stock < requestedQuantity) {
      return {
        isAvailable: false,
        availableQuantity: product.stock,
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${requestedQuantity}`,
      };
    }

    return {
      isAvailable: true,
      availableQuantity: product.stock,
      message: 'Stock available',
    };
  }

  processStockReduction(
    productAggregate: ProductAggregate,
    quantity: number,
  ): void {
    const availability = this.checkStockAvailability(
      productAggregate.product,
      quantity,
    );

    if (!availability.isAvailable) {
      throw new Error(availability.message);
    }

    productAggregate.reduceStockWithValidation(quantity);
  }

  getInventoryReport(products: Product[]): {
    totalProducts: number;
    inStock: Product[];
    lowStock: Product[];
    outOfStock: Product[];
    totalInventoryValue: number;
    criticalProducts: Product[];
  } {
    const inStockSpec = new ProductInStockSpecification();
    const lowStockSpec = new ProductLowStockSpecification(
      this.lowStockThreshold,
    );
    const outOfStockSpec = inStockSpec.not();

    const inStock = products.filter(
      (p) => inStockSpec.isSatisfiedBy(p) && !lowStockSpec.isSatisfiedBy(p),
    );
    const lowStock = products.filter(
      (p) => lowStockSpec.isSatisfiedBy(p) && inStockSpec.isSatisfiedBy(p),
    );
    const outOfStock = products.filter((p) => outOfStockSpec.isSatisfiedBy(p));

    const totalInventoryValue = products.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    );

    const criticalProducts = [...lowStock, ...outOfStock];

    return {
      totalProducts: products.length,
      inStock,
      lowStock,
      outOfStock,
      totalInventoryValue,
      criticalProducts,
    };
  }

  getProductsByCategory(products: Product[], categoryId: string): Product[] {
    const categorySpec = new ProductByCategorySpecification(categoryId);
    return products.filter((product) => categorySpec.isSatisfiedBy(product));
  }

  getAvailableProductsForSale(products: Product[]): Product[] {
    const availableSpec = new ProductAvailableForSaleSpecification();
    return products.filter((product) => availableSpec.isSatisfiedBy(product));
  }

  calculateRestockRecommendations(products: Product[]): Array<{
    productId: string;
    productName: string;
    currentStock: number;
    recommendedQuantity: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
  }> {
    const recommendations: Array<{
      productId: string;
      productName: string;
      currentStock: number;
      recommendedQuantity: number;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      reason: string;
    }> = [];

    for (const product of products) {
      if (product.isOutOfStock()) {
        recommendations.push({
          productId: product.id,
          productName: product.name,
          currentStock: product.stock,
          recommendedQuantity: 20,
          priority: 'HIGH',
          reason: 'Product is completely out of stock',
        });
      } else if (product.isLowStock(this.lowStockThreshold)) {
        recommendations.push({
          productId: product.id,
          productName: product.name,
          currentStock: product.stock,
          recommendedQuantity: 15 - product.stock,
          priority: 'MEDIUM',
          reason: `Stock is below threshold of ${this.lowStockThreshold} units`,
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  validateInventoryTransaction(
    productAggregate: ProductAggregate,
    transactionType: 'SALE' | 'RESTOCK' | 'ADJUSTMENT',
    quantity: number,
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (quantity <= 0) {
      errors.push('Quantity must be positive');
    }

    if (transactionType === 'SALE') {
      const availability = this.checkStockAvailability(
        productAggregate.product,
        quantity,
      );
      if (!availability.isAvailable) {
        errors.push(availability.message);
      }
    }

    // Additional business rules can be added here
    const businessRuleErrors = productAggregate.validateBusinessRules();
    errors.push(...businessRuleErrors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
