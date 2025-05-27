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
  Req,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../../application/dtos/product.dto';
import { Request } from 'express';
import { HateoasResponse } from '../../interfaces/http/hateoas.link';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os produtos',
    description: 'Retorna uma lista de todos os produtos disponíveis',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos recuperada com sucesso',
    type: [ProductResponseDto],
  })
  async findAll(
    @Req() request: Request,
  ): Promise<HateoasResponse<ProductResponseDto[]>> {
    const products = await this.productService.findAll();

    const response = new HateoasResponse(products);

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    response.addLink(`${baseUrl}/products`, 'self', 'GET');

    response.addLink(`${baseUrl}/products`, 'create', 'POST');

    products.forEach((product) => {
      response.addLink(
        `${baseUrl}/products/${product.id}`,
        `product_${product.id}`,
        'GET',
      );
    });

    return response;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um produto por ID',
    description: 'Retorna um produto específico com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<HateoasResponse<ProductResponseDto>> {
    try {
      const product = await this.productService.findById(id);

      const response = new HateoasResponse(product);

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      response.addLink(`${baseUrl}/products/${id}`, 'self', 'GET');

      response.addLink(`${baseUrl}/products`, 'collection', 'GET');

      response.addLink(`${baseUrl}/products/${id}`, 'update', 'PUT');

      response.addLink(`${baseUrl}/products/${id}`, 'delete', 'DELETE');

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Criar um novo produto',
    description: 'Cria um novo produto com os dados fornecidos',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Dados para criação do produto',
  })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<ProductResponseDto>> {
    const product = await this.productService.create(createProductDto);

    const response = new HateoasResponse(product);

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    response.addLink(`${baseUrl}/products/${product.id}`, 'self', 'GET');

    response.addLink(`${baseUrl}/products`, 'collection', 'GET');

    response.addLink(`${baseUrl}/products/${product.id}`, 'update', 'PUT');

    response.addLink(`${baseUrl}/products/${product.id}`, 'delete', 'DELETE');

    return response;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar um produto',
    description: 'Atualiza os dados de um produto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Dados para atualização do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<ProductResponseDto>> {
    try {
      const product = await this.productService.update(id, updateProductDto);

      const response = new HateoasResponse(product);

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      response.addLink(`${baseUrl}/products/${id}`, 'self', 'GET');

      response.addLink(`${baseUrl}/products`, 'collection', 'GET');

      response.addLink(`${baseUrl}/products/${id}`, 'update', 'PUT');

      response.addLink(`${baseUrl}/products/${id}`, 'delete', 'DELETE');

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir um produto',
    description: 'Exclui um produto com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'Produto excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    await this.productService.delete(id);
  }
}
