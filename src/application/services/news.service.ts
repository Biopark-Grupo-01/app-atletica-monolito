import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { News } from 'src/domain/entities/news.entity';
import {
  NewsRepository,
  NEWS_REPOSITORY,
} from 'src/domain/repositories/news.repository.interface';
import { CreateNewsDto, UpdateNewsDto } from 'src/application/dto/news.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private newsRepository: NewsRepository,
  ) {}

  async findAll(): Promise<News[]> {
    return this.newsRepository.findAll();
  }

  async findById(id: string): Promise<News> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = new News({
      id: uuidv4(),
      ...createNewsDto,
    });

    return this.newsRepository.create(news);
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    const updatedNews = await this.newsRepository.update(id, updateNewsDto);
    if (!updatedNews) {
      throw new NotFoundException(`Failed to update news with ID ${id}`);
    }

    return updatedNews;
  }

  async delete(
    id: string,
  ): Promise<{ success: boolean; newsId: string; newsTitle: string | null }> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    const result = await this.newsRepository.delete(id);
    return {
      success: result.success,
      newsId: id,
      newsTitle: result.news?.title || null,
    };
  }
}
