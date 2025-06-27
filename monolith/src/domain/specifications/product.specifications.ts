import { BaseSpecification } from './base.specification';
import { Product } from '../entities/product.entity';

export class ProductInStockSpecification extends BaseSpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return !product.isOutOfStock();
  }
}

export class ProductLowStockSpecification extends BaseSpecification<Product> {
  constructor(private threshold: number = 5) {
    super();
  }

  isSatisfiedBy(product: Product): boolean {
    return product.isLowStock(this.threshold);
  }
}

export class ProductByCategorySpecification extends BaseSpecification<Product> {
  constructor(private categoryId: string) {
    super();
  }

  isSatisfiedBy(product: Product): boolean {
    return product.categoryId === this.categoryId;
  }
}

export class ProductPriceRangeSpecification extends BaseSpecification<Product> {
  constructor(
    private minPrice: number,
    private maxPrice: number,
  ) {
    super();
  }

  isSatisfiedBy(product: Product): boolean {
    return product.price >= this.minPrice && product.price <= this.maxPrice;
  }
}

export class ProductAvailableForSaleSpecification extends BaseSpecification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return !product.isOutOfStock() && product.price > 0;
  }
}
