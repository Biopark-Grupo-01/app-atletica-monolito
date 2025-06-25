import { IProductCategoryRepository } from '@app/domain/repositories/product-category.repository.interface';
import { ProductCategory } from '@app/domain/entities/product-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmProductCategoryRepository
  implements IProductCategoryRepository
{
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async findAll(): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find();
  }

  async findById(id: string): Promise<ProductCategory | null> {
    return this.productCategoryRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    return this.productCategoryRepository.findOne({ where: { name } });
  }

  async create(category: ProductCategory): Promise<ProductCategory> {
    return this.productCategoryRepository.save(category);
  }

  async update(
    id: string,
    category: Partial<ProductCategory>,
  ): Promise<ProductCategory | null> {
    await this.productCategoryRepository.update(id, category);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productCategoryRepository.delete(id);
  }
}
