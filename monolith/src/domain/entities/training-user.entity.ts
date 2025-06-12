import {
  // Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Training } from '../entities/training.entity';

@Entity('training_user')
export class TrainingUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Training, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_id' })
  training: Training;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
