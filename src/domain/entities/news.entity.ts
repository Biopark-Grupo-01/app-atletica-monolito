import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NewsType {
  LOCAL = 'local',
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
  SPORTS = 'sports',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other',
}

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  publicationDate: Date;

  @Column()
  author: string;

  @Column({
    type: 'enum',
    enum: NewsType,
    default: NewsType.OTHER,
  })
  type: NewsType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<News>) {
    Object.assign(this, partial);
  }

  updatePublicationDate(date: Date): void {
    if (date > new Date()) {
      throw new Error('Publication date cannot be in the future');
    }
    this.publicationDate = date;
  }
}
