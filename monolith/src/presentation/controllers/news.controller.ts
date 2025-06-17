/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { NewsService } from 'src/application/services/news.service';
import { HateoasService } from 'src/application/services/hateoas.service';
import { CreateNewsDto, UpdateNewsDto } from 'src/application/dtos/news.dto';
import { SuccessResponse } from 'src/interfaces/http/response.interface';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly hateoasService: HateoasService,
  ) {}

  private readonly basePath = '/news';

  @Get()
  async findAll() {
    try {
      const newsList = await this.newsService.findAll();
      const newsWithLinks = this.hateoasService.addLinksToCollection(
        newsList,
        this.basePath,
      );
      const collectionLinks = this.hateoasService.createLinksForCollection(
        this.basePath,
      );

      return new SuccessResponse(
        HttpStatus.OK,
        newsWithLinks,
        'Lista de notícias',
        collectionLinks,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao listar notícias:', error.message);
      } else {
        console.error('Erro ao listar notícias:', error);
      }
      throw new HttpException(
        'Erro ao listar notícias',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const news = await this.newsService.findById(id);

      if (!news) {
        throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
      }

      const newsWithLinks = this.hateoasService.addLinksToItem(
        news,
        this.basePath,
      );

      return new SuccessResponse(
        HttpStatus.OK,
        newsWithLinks,
        'Notícia encontrada',
        newsWithLinks._links,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar notícia:', error.message);
      } else {
        console.error('Erro ao buscar notícia:', error);
      }
      throw new HttpException(
        'Erro ao buscar notícia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createNewsDto: CreateNewsDto) {
    try {
      const newNews = await this.newsService.create(createNewsDto);
      const newsWithLinks = this.hateoasService.addLinksToItem(
        newNews,
        this.basePath,
      );

      return new SuccessResponse(
        HttpStatus.CREATED,
        newsWithLinks,
        'Notícia criada com sucesso',
        newsWithLinks._links,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar notícia:', error.message);
      } else {
        console.error('Erro ao criar notícia:', error);
      }
      throw new HttpException(
        'Erro ao criar notícia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    try {
      const updatedNews = await this.newsService.update(id, updateNewsDto);

      if (!updatedNews) {
        throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
      }

      const newsWithLinks = this.hateoasService.addLinksToItem(
        updatedNews,
        this.basePath,
      );

      return new SuccessResponse(
        HttpStatus.OK,
        newsWithLinks,
        'Notícia atualizada com sucesso',
        newsWithLinks._links,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao atualizar notícia:', error.message);
      } else {
        console.error('Erro ao atualizar notícia:', error);
      }
      throw new HttpException(
        'Erro ao atualizar notícia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.newsService.delete(id);

      if (!result.success) {
        throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponse(
        HttpStatus.OK,
        null,
        'Notícia removida com sucesso',
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao remover notícia:', error.message);
      } else {
        console.error('Erro ao remover notícia:', error);
      }
      throw new HttpException(
        'Erro ao remover notícia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
