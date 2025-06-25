import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  constructor(partial: Partial<ProductCategory>) {
    Object.assign(this, partial);
  }
}
