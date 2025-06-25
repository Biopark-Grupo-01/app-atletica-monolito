import { HateoasService } from '@app/application/services/hateoas.service';
import { ProductCategoryService } from '@app/application/services/product-category.service';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '../../interfaces/http/response.interface';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
    private readonly hateoasService: HateoasService,
  ) {}

  private readonly basePath = '/product-categories';

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  @ApiResponse({
    status: 200,
    description: 'A list of product categories.',
    type: SuccessResponse,
  })
  async findAll() {
    const categories = await this.productCategoryService.findAll();
    const categoriesWithLinks = this.hateoasService.addLinksToCollection(
      categories,
      this.basePath,
    );
    const collectionLinks = this.hateoasService.createLinksForCollection(
      this.basePath,
    );

    return new SuccessResponse(
      HttpStatus.OK,
      categoriesWithLinks,
      'Product categories retrieved successfully.',
      collectionLinks,
    );
  }
}
