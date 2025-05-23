import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../../application/dtos/product.dto';
import { Product } from '../../domain/entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos', description: 'Retorna uma lista de todos os produtos disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de produtos recuperada com sucesso', type: [ProductResponseDto] })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto por ID', description: 'Retorna um produto específico com base no ID fornecido' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findById(@Param('id') id: string): Promise<Product> {
    try {
      return await this.productService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto', description: 'Cria um novo produto com os dados fornecidos' })
  @ApiBody({ type: CreateProductDto, description: 'Dados para criação do produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: ProductResponseDto })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto', description: 'Atualiza os dados de um produto existente' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateProductDto, description: 'Dados para atualização do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um produto', description: 'Exclui um produto com base no ID fornecido' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Produto excluído com sucesso', schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      productId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      productName: { type: 'string', example: 'Camisa da Atlética', nullable: true }
    }
  }})
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(@Param('id') id: string): Promise<{ success: boolean; productId: string; productName: string | null }> {
    try {
      const result = await this.productService.delete(id);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
