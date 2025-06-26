import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { News } from '../../domain/entities/news.entity';
import {
  INewsRepository,
  NEWS_REPOSITORY,
} from '../../domain/repositories/news.repository.interface';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';
import { NotificationService } from '../../modules/notification/notification.service';

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private newsRepository: INewsRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
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

    const createdNews = await this.newsRepository.create(news);

    const users = await this.userService.findAll();
    const rolesToExclude = ['DIRECTOR', 'ADMIN'];
    const usersToNotify = users.filter(
      (user) => user.role && !rolesToExclude.includes(user.role.name),
    );

    const fcmTokens = usersToNotify
      .map((user) => user.fcmToken)
      .filter((token): token is string => !!token);

    if (fcmTokens.length > 0) {
      this.notificationService.broadcastNotification(
        fcmTokens,
        `Nova Notícia: ${createdNews.title}`,
        createdNews.description, // Corrected property name
      );
    }

    return createdNews;
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
