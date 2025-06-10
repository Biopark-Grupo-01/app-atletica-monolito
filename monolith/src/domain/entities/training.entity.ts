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

@Entity('trainings')
export class Training {
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
  coach: string;

  @Column()
  responsible: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => TrainingModality, (modality) => modality.trainings, {
    eager: true,
  })
  @JoinColumn({ name: 'training_modality_id' })
  trainingModality: TrainingModality;

  @Column({ name: 'training_modality_id', nullable: false })
  trainingModalityId: string;

  constructor(partial: Partial<Training>) {
    Object.assign(this, partial);
  }
}
