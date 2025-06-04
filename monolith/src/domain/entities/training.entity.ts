import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  modality: string;

  @Column()
  place: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column()
  coach: string;

  @Column()
  responsible: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<Training>) {
    Object.assign(this, partial);
  }
}
