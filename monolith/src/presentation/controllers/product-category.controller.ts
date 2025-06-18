import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ProductCategoryService } from '../../application/services/product-category.service';
import { CreateProductCategoryDto } from '../../application/dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from '../../application/dtos/update-product-category.dto';
import { ProductCategoryResponseDto } from '../../application/dtos/product-category-response.dto';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductCategoryResponseDto[]>>> {
    const categories = await this.productCategoryService.findAll();
    return res
      .status(HttpStatus.OK)
      .json(
        new SuccessResponse(
          HttpStatus.OK,
          categories,
          'Categories retrieved successfully',
        ),
      );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async findById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductCategoryResponseDto>>> {
    try {
      const category = await this.productCategoryService.findOne(id);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            category,
            'Category retrieved successfully',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiBody({ type: CreateProductCategoryDto })
  @ApiResponse({ status: 201, type: SuccessResponse })
  async create(
    @Body() dto: CreateProductCategoryDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductCategoryResponseDto>>> {
    const category = await this.productCategoryService.create(dto);
    return res
      .status(HttpStatus.CREATED)
      .json(
        new SuccessResponse(
          HttpStatus.CREATED,
          category,
          'Category created successfully',
        ),
      );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateProductCategoryDto })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductCategoryDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<ProductCategoryResponseDto>>> {
    try {
      const category = await this.productCategoryService.update(id, dto);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            category,
            'Category updated successfully',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.productCategoryService.delete(id);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            undefined,
            'Category deleted successfully',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
    }
  }
}
