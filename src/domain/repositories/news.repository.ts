import { News } from '../entities/news.entity';

export const NEWS_REPOSITORY_TOKEN = Symbol('INewsRepository');

export interface NewsRepository {
  findAll(): Promise<News[]>;
  findById(id: string): Promise<News | null>;
  findByType(type: string): Promise<News[]>;
  create(news: News): Promise<News>;
  update(id: string, news: Partial<News>): Promise<News | null>;
  delete(id: string): Promise<{ success: boolean; news: News | null }>;
}
