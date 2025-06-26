import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { Money } from '../value-objects/money.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';
import { AggregateRoot } from '../aggregates/aggregate-root';
import {
  ProductOutOfStockEvent,
  ProductLowStockEvent,
  ProductCreatedEvent,
  ProductStockUpdatedEvent,
} from '../events/product.events';

@Entity('products')
export class Product extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  constructor(partial: Partial<Product>) {
    super();
    Object.assign(this, partial);
  }

  // Value Object methods
  setPrice(amount: number, currency: string = 'BRL'): void {
    const money = new Money(amount, currency);
    this.price = money.amount;
  }

  setStock(quantity: number): void {
    const stockQuantity = new StockQuantity(quantity);
    this.stock = stockQuantity.value;
  }

  updateStock(quantity: number): void {
    const currentStock = new StockQuantity(this.stock);
    const newStock = currentStock.add(new StockQuantity(quantity));
    this.stock = newStock.value;
  }

  reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    const currentStock = new StockQuantity(this.stock);
    if (!currentStock.canReduce(quantity)) {
      throw new Error('Insufficient stock');
    }
    const previousStock = this.stock;
    const newStock = currentStock.subtract(new StockQuantity(quantity));
    this.stock = newStock.value;

    // Emit domain events
    this.addDomainEvent(
      new ProductStockUpdatedEvent(
        this.id,
        previousStock,
        this.stock,
        'REDUCE',
      ),
    );

    if (this.isOutOfStock()) {
      this.addDomainEvent(
        new ProductOutOfStockEvent(this.id, this.name, this.categoryId),
      );
    } else if (this.isLowStock()) {
      this.addDomainEvent(
        new ProductLowStockEvent(this.id, this.name, this.stock, 5),
      );
    }
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    const previousStock = this.stock;
    const currentStock = new StockQuantity(this.stock);
    const newStock = currentStock.add(new StockQuantity(quantity));
    this.stock = newStock.value;

    this.addDomainEvent(
      new ProductStockUpdatedEvent(this.id, previousStock, this.stock, 'ADD'),
    );
  }

  // Static factory method for creating new products
  static create(
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: string,
  ): Product {
    const product = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
    });

    product.addDomainEvent(
      new ProductCreatedEvent(product.id, name, price, stock, categoryId),
    );

    return product;
  }

  updatePrice(price: number): void {
    const money = new Money(price);
    this.price = money.amount;
  }

  isOutOfStock(): boolean {
    const stockQuantity = new StockQuantity(this.stock);
    return stockQuantity.isOutOfStock();
  }

  isLowStock(threshold: number = 5): boolean {
    const stockQuantity = new StockQuantity(this.stock);
    return stockQuantity.isLowStock(threshold);
  }

  canReduceStock(quantity: number): boolean {
    const stockQuantity = new StockQuantity(this.stock);
    return stockQuantity.canReduce(quantity);
  }
}
