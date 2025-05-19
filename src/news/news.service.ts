// news.service.ts
import { Injectable } from '@nestjs/common';
import { CreateNewsDto, UpdateNewsDto } from './news.dto';

@Injectable()
export class NewsService {
  private readonly news = [];
  private nextId = 1;

  create(createNewsDto: CreateNewsDto) {
    const newNews = {
      id: this.nextId++,
      ...createNewsDto,
    };
    this.news.push(newNews);
    return newNews;
  }

  findAll() {
    return this.news;
  }

  findOne(id: number) {
    return this.news.find((news) => news.id === id);
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    const newsIndex = this.news.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return null; // Ou você pode lançar um erro
    }
    this.news[newsIndex] = { ...this.news[newsIndex], ...updateNewsDto };
    return this.news[newsIndex];
  }

  remove(id: number) {
    this.news = this.news.filter((news) => news.id !== id);
    return { message: `Notícia com ID ${id} removida com sucesso.` };
  }
}