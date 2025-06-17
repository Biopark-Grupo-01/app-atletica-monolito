import { News } from 'src/domain/entities/news.entity';

export const NEWS_REPOSITORY = 'NEWS_REPOSITORY';

export interface NewsRepository {
  findAll(): Promise<News[]>;
  findById(id: string): Promise<News | null>;
  create(news: News): Promise<News>;
  update(id: string, news: Partial<News>): Promise<News | null>;
  delete(id: string): Promise<{ success: boolean; news: News | null }>;
}
