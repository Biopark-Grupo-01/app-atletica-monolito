/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(dto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create(dto);
    return this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.find();
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) throw new NotFoundException('Notícia não encontrada');
    return news;
  }

  async update(id: string, dto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    const updated = Object.assign(news, dto);
    return this.newsRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.newsRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Notícia não encontrada');
  }
}
