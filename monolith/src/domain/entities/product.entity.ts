import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
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

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }

  updateStock(quantity: number): void {
    if (this.stock + quantity < 0) {
      throw new Error('Insufficient stock');
    }
    this.stock += quantity;
  }

  updatePrice(price: number): void {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    this.price = price;
  }
}
