import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProductCategory } from '@app/domain/entities/product-category.entity';
import {
  IProductCategoryRepository,
  PRODUCT_CATEGORY_REPOSITORY_TOKEN,
} from '@app/domain/repositories/product-category.repository.interface';
import { CreateProductCategoryDto } from '../dtos/product-category.dto';

@Injectable()
export class ProductCategoryService implements OnModuleInit {
  private readonly logger = new Logger(ProductCategoryService.name);

  constructor(
    @Inject(PRODUCT_CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: IProductCategoryRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('Populando categorias de produtos...');
    await this.seedDefaultProductCategories();
  }

  private async seedDefaultProductCategories() {
    const defaultCategories: CreateProductCategoryDto[] = [
      {
        name: 'Roupas',
        icon: 'checkroom',
      },
      {
        name: 'Canecas',
        icon: 'local_cafe',
      },
      {
        name: 'Chaveiros',
        icon: 'key',
      },
      {
        name: 'Tatuagens',
        icon: 'brush',
      },
    ];

    for (const categoryData of defaultCategories) {
      const categoryExists = await this.categoryRepository.findByName(
        categoryData.name,
      );
      if (!categoryExists) {
        this.logger.log(
          `Criando categoria de produto padrão: ${categoryData.name}`,
        );
        const newCategory = new ProductCategory(categoryData);
        await this.categoryRepository.create(newCategory);
      }
    }
  }

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    const newCategory = new ProductCategory(createProductCategoryDto);
    return this.categoryRepository.create(newCategory);
  }

  async findAll(): Promise<ProductCategory[]> {
    return this.categoryRepository.findAll();
  }
}
