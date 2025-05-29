import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../../application/dtos/product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';
import { Response } from 'express';
import { HateoasService } from '../../application/services/hateoas.service';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponse,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductResponseDto>>> {
    try {
      const product = await this.productService.create(createProductDto);
      const productWithLinks = this.hateoasService.addLinksToItem(
        product,
        'products',
      );
      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse<ProductResponseDto>(
            HttpStatus.CREATED,
            productWithLinks,
            'Product created successfully',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            'Error creating product',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: SuccessResponse,
  })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductResponseDto[]>>> {
    try {
      const products = await this.productService.findAll();
      const productsWithLinks = this.hateoasService.addLinksToCollection(
        products,
        'products',
      );
      const collectionLinks =
        this.hateoasService.createLinksForCollection('products');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<ProductResponseDto[]>(
            HttpStatus.OK,
            productsWithLinks,
            'Products retrieved successfully',
            collectionLinks,
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving products',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: ErrorResponse,
  })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductResponseDto>>> {
    try {
      const product = await this.productService.findById(id);
      const productWithLinks = this.hateoasService.addLinksToItem(
        product,
        'products',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<ProductResponseDto>(
            HttpStatus.OK,
            productWithLinks,
            'Product retrieved successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving product',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductResponseDto>>> {
    try {
      const product = await this.productService.update(id, updateProductDto);
      const productWithLinks = this.hateoasService.addLinksToItem(
        product,
        'products',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<ProductResponseDto>(
            HttpStatus.OK,
            productWithLinks,
            'Product updated successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            'Error updating product',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: ErrorResponse,
  })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.productService.delete(id);
      const links: HateoasLinkDto[] =
        this.hateoasService.createLinksForCollection('products');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<void>(
            HttpStatus.OK,
            undefined,
            'Product deleted successfully',
            links,
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error deleting product',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }
}
