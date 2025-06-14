import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/domain/entities/news.entity';
import { NewsRepository } from 'src/domain/repositories/news.repository.interface';

@Injectable()
export class TypeOrmNewsRepository implements NewsRepository {
  constructor(
    @InjectRepository(News)
    private readonly repository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<News | null> {
    return this.repository.findOneBy({ id });
  }

  async create(news: News): Promise<News> {
    return this.repository.save(news);
  }

  async update(id: string, news: Partial<News>): Promise<News | null> {
    await this.repository.update(id, news);
    return this.findById(id);
  }

  async delete(id: string): Promise<{ success: boolean; news: News | null }> {
    const news = await this.findById(id);
    if (!news) return { success: false, news: null };
    await this.repository.delete(id);
    return { success: true, news };
  }
}
