import { Product } from '../entities/product.entity';
import { ProductCategory } from '../entities/product-category.entity';
import { AggregateRoot } from './aggregate-root';
import {
  ProductOutOfStockEvent,
  ProductLowStockEvent,
  ProductCreatedEvent,
} from '../events/product.events';

export class ProductAggregate extends AggregateRoot {
  private _product: Product;
  private _category: ProductCategory;

  constructor(product: Product, category: ProductCategory) {
    super();
    this._product = product;
    this._category = category;
  }

  get product(): Product {
    return this._product;
  }

  get category(): ProductCategory {
    return this._category;
  }

  get id(): string {
    return this._product.id;
  }

  get name(): string {
    return this._product.name;
  }

  get price(): number {
    return this._product.price;
  }

  get stock(): number {
    return this._product.stock;
  }

  get categoryId(): string {
    return this._product.categoryId;
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }

    this._product.updatePrice(newPrice);
  }

  updateStock(quantity: number): void {
    this._product.updateStock(quantity);
  }

  reduceStockWithValidation(quantity: number): void {
    if (!this.canReduceStock(quantity)) {
      throw new Error(
        `Insufficient stock. Available: ${this._product.stock}, Requested: ${quantity}`,
      );
    }

    this._product.reduceStock(quantity);

    // Check business rules and emit events
    if (this._product.isOutOfStock()) {
      this.addDomainEvent(
        new ProductOutOfStockEvent(
          this._product.id,
          this._product.name,
          this._category.id,
        ),
      );
    } else if (this._product.isLowStock()) {
      this.addDomainEvent(
        new ProductLowStockEvent(
          this._product.id,
          this._product.name,
          this._product.stock,
          5,
        ),
      );
    }
  }

  addStockWithValidation(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity to add must be positive');
    }

    this._product.addStock(quantity);
  }

  canReduceStock(quantity: number): boolean {
    return this._product.canReduceStock(quantity);
  }

  isOutOfStock(): boolean {
    return this._product.isOutOfStock();
  }

  isLowStock(threshold: number = 5): boolean {
    return this._product.isLowStock(threshold);
  }

  changeCategory(newCategory: ProductCategory): void {
    if (!newCategory || !newCategory.id) {
      throw new Error('Invalid category');
    }

    this._category = newCategory;
    this._product.categoryId = newCategory.id;
  }

  calculateInventoryValue(): number {
    return this._product.price * this._product.stock;
  }

  updateDetails(name?: string, description?: string, price?: number): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new Error('Product name cannot be empty');
      }
      this._product.name = name.trim();
    }

    if (description !== undefined) {
      this._product.description = description;
    }

    if (price !== undefined) {
      this.updatePrice(price);
    }
  }

  getStockStatus(): 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK' {
    if (this.isOutOfStock()) {
      return 'OUT_OF_STOCK';
    }
    if (this.isLowStock()) {
      return 'LOW_STOCK';
    }
    return 'IN_STOCK';
  }

  getProductSummary(): {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    inventoryValue: number;
  } {
    return {
      id: this._product.id,
      name: this._product.name,
      category: this._category.name,
      price: this._product.price,
      stock: this._product.stock,
      status: this.getStockStatus(),
      inventoryValue: this.calculateInventoryValue(),
    };
  }

  // Business rule validation
  validateBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this._product.name || this._product.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (this._product.price < 0) {
      errors.push('Product price cannot be negative');
    }

    if (this._product.stock < 0) {
      errors.push('Product stock cannot be negative');
    }

    if (!this._product.categoryId || !this._category) {
      errors.push('Product must belong to a category');
    }

    return errors;
  }

  // Factory method to create a new ProductAggregate
  static create(
    name: string,
    description: string,
    price: number,
    stock: number,
    category: ProductCategory,
  ): ProductAggregate {
    if (!category || !category.id) {
      throw new Error('Category is required to create a product');
    }

    const product = Product.create(
      name,
      description,
      price,
      stock,
      category.id,
    );
    const aggregate = new ProductAggregate(product, category);

    aggregate.addDomainEvent(
      new ProductCreatedEvent(product.id, name, price, stock, category.id),
    );

    return aggregate;
  }

  // Factory method to reconstruct from persistence
  static fromPersistence(
    product: Product,
    category: ProductCategory,
  ): ProductAggregate {
    return new ProductAggregate(product, category);
  }
}
