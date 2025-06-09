import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ name: 'profile_picture_url', nullable: true, type: 'text' })
  profilePicture?: string;

  @Column({ name: 'google_id', nullable: true, unique: true })
  googleId?: string;

  @Column({ name: 'fcm_token', nullable: true, type: 'text' })
  fcmToken?: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @Column({ name: 'role_id', nullable: true })
  roleId?: string;

  @Column({
    name: 'plan_start_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  planStartDate?: Date;

  @Column({
    name: 'plan_end_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  planEndDate?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
