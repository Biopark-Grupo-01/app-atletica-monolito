import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../../../domain/entities/product-category.entity';
import { IProductCategoryRepository } from '../../../domain/repositories/product-category.repository.interface';
import { CreateProductCategoryDto } from '../../../application/dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from '../../../application/dtos/update-product-category.dto';

@Injectable()
export class TypeOrmProductCategoryRepository
  implements IProductCategoryRepository
{
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    const category = this.categoryRepository.create(createProductCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<ProductCategory[]> {
    return this.categoryRepository.find();
  }

  async findById(id: string): Promise<ProductCategory | null> {
    return this.categoryRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    return this.categoryRepository.findOneBy({ name });
  }

  async update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory | null> {
    await this.categoryRepository.update(id, updateProductCategoryDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
