import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrainingModality } from './training-modality.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  place: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column()
  responsible: string;

  @ManyToOne(() => TrainingModality, { eager: true })
  @JoinColumn({ name: 'training_modality_id' })
  trainingModality: TrainingModality;

  @Column({ name: 'training_modality_id', nullable: true })
  trainingModalityId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(partial: Partial<Match>) {
    Object.assign(this, partial);
  }
}
