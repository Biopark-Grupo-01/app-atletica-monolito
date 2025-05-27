/* eslint-disable prettier/prettier */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;
}
