import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News, NewsType } from '../../../domain/entities/news.entity';
import { NewsRepository } from 'src/domain/repositories/news.repository';

@Injectable()
export class TypeOrmNewsRepository implements NewsRepository {
  private readonly logger = new Logger(TypeOrmNewsRepository.name);

  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return this.newsRepository.find();
  }

  async findById(id: string): Promise<News | null> {
    return this.newsRepository.findOneBy({ id });
  }

  async findByType(type: string): Promise<News[]> {
    const newsType = type as NewsType;
    return this.newsRepository.findBy({ type: newsType });
  }

  async create(news: News): Promise<News> {
    return this.newsRepository.save(news);
  }

  async update(id: string, newsData: Partial<News>): Promise<News | null> {
    await this.newsRepository.update(id, newsData);
    return this.findById(id);
  }

  async delete(id: string): Promise<{ success: boolean; news: News | null }> {
    try {
      const news = await this.findById(id);
      this.logger.log(`Attempting to delete news with ID: ${id}`);

      if (!news) {
        this.logger.warn(`News with ID ${id} not found for deletion`);
        return { success: false, news: null };
      }

      this.logger.log(`Found news to delete: ${JSON.stringify(news)}`);
      await this.newsRepository.remove(news);

      const checkIfDeleted = await this.findById(id);
      const success = checkIfDeleted === null;

      this.logger.log(`Deletion success: ${success}`);

      return {
        success,
        news,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error deleting news: ${error.message}`, error.stack);
      } else {
        this.logger.error('Error deleting news', error);
      }
      return { success: false, news: null };
    }
  }
}
