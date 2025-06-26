import {
  Injectable,
  NotFoundException,
  Inject,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_TOKEN,
} from '../../domain/repositories/product.repository.interface';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../dtos/product.dto';
import {
  IProductCategoryRepository,
  PRODUCT_CATEGORY_REPOSITORY_TOKEN,
} from '../../domain/repositories/product-category.repository.interface';

@Injectable()
export class ProductService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private productRepository: IProductRepository,
    @Inject(PRODUCT_CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: IProductCategoryRepository,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Populando produtos...');
    await this.seedDefaultProduct();
  }

  private async seedDefaultProduct() {
    try {
      // Aguardar as categorias serem criadas
      let attempts = 0;
      let categoriesReady = false;

      while (!categoriesReady && attempts < 10) {
        const roupasCategory =
          await this.categoryRepository.findByName('Roupas');
        const canecasCategory =
          await this.categoryRepository.findByName('Canecas');
        const chaveirosCategory =
          await this.categoryRepository.findByName('Chaveiros');

        if (roupasCategory && canecasCategory && chaveirosCategory) {
          categoriesReady = true;

          const defaultProducts: CreateProductDto[] = [
            {
              name: 'Camiseta Oficial Feminina',
              description: 'Camiseta oficial feminina da Atlética Biopark',
              price: 20.0,
              stock: 20,
              categoryId: roupasCategory.id,
            },
            {
              name: 'Camiseta Oficial Masculina',
              description: 'Camiseta oficial masculina da Atlética Biopark',
              price: 20.0,
              stock: 20,
              categoryId: roupasCategory.id,
            },
            {
              name: 'Caneca Oficial Atlética',
              description: 'Caneca oficial da Atlética Biopark',
              price: 15.0,
              stock: 30,
              categoryId: canecasCategory.id,
            },
            {
              name: 'Chaveiro Oficial',
              description: 'Chaveiro oficial da Atlética Biopark',
              price: 5.0,
              stock: 50,
              categoryId: chaveirosCategory.id,
            },
          ];

          const existingProducts = await this.productRepository.findAll();

          for (const productData of defaultProducts) {
            const productExists = existingProducts.find(
              (p) => p.name === productData.name,
            );

            if (!productExists) {
              this.logger.log(`Criando produto padrão: ${productData.name}`);
              const newProduct = new Product(productData);
              await this.productRepository.create(newProduct);
            }
          }
        } else {
          attempts++;
          this.logger.log(
            `Aguardando categorias serem criadas... tentativa ${attempts}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (!categoriesReady) {
        this.logger.warn(
          'Não foi possível criar produtos: categorias não encontradas',
        );
      }
    } catch (error) {
      this.logger.error('Erro ao popular produtos padrão:', error);
    }
  }
  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      categoryId: product.categoryId,
    };
  }

  private mapArrayToResponseDto(products: Product[]): ProductResponseDto[] {
    return products.map((p) => this.mapToResponseDto(p));
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();
    return this.mapArrayToResponseDto(products);
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const newProduct = await this.productRepository.create(createProductDto);
    return this.mapToResponseDto(newProduct);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productRepository.update(
      id,
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found or failed to update.`,
      );
    }
    return this.mapToResponseDto(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    const success = await this.productRepository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `Product with ID ${id} could not be deleted.`,
      );
    }
  }
}
