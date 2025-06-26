import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  IProductCategoryRepository,
  PRODUCT_CATEGORY_REPOSITORY_TOKEN,
} from '../../domain/repositories/product-category.repository.interface';
import { ProductCategory } from '../../domain/entities/product-category.entity';
import { CreateProductCategoryDto } from '../dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dtos/update-product-category.dto';
import { ProductCategoryResponseDto } from '../dtos/product-category-response.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @Inject(PRODUCT_CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: IProductCategoryRepository,
  ) {}

  private mapToResponseDto(
    category: ProductCategory,
  ): ProductCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapArrayToResponseDto(
    categories: ProductCategory[],
  ): ProductCategoryResponseDto[] {
    return categories.map((category) => this.mapToResponseDto(category));
  }

  async create(
    createCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    const existing = await this.categoryRepository.findByName(
      createCategoryDto.name,
    );
    if (existing) {
      throw new ConflictException(
        `Category with name '${createCategoryDto.name}' already exists.`,
      );
    }
    const newCategory = await this.categoryRepository.create(createCategoryDto);
    return this.mapToResponseDto(newCategory);
  }

  async findAll(): Promise<ProductCategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return this.mapArrayToResponseDto(categories);
  }

  async findOne(id: string): Promise<ProductCategoryResponseDto> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    return this.mapToResponseDto(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    const categoryToUpdate = await this.categoryRepository.findById(id);
    if (!categoryToUpdate) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    if (
      updateCategoryDto.name &&
      updateCategoryDto.name !== categoryToUpdate.name
    ) {
      const existing = await this.categoryRepository.findByName(
        updateCategoryDto.name,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Category name '${updateCategoryDto.name}' is already in use.`,
        );
      }
    }
    const updatedCategory = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );
    if (!updatedCategory) {
      throw new NotFoundException(
        `Category with ID '${id}' not found during update operation.`,
      );
    }
    return this.mapToResponseDto(updatedCategory);
  }

  async delete(id: string): Promise<void> {
    const success = await this.categoryRepository.delete(id);
    if (!success) {
      throw new BadRequestException(
        `Category with ID ${id} could not be deleted.`,
      );
    }
  }
}
