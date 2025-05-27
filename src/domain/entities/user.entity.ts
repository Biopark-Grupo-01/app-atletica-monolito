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

export interface UserCreateProps {
  name: string;
  registrationNumber?: string;
  cpf?: string;
  email: string;
  hashedPassword?: string;
  phone?: string;
  role: Role;
  googleId?: string;
  profilePictureUrl?: string;
  fcmToken?: string;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'registration_number', nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'hashed_password', nullable: true })
  hashedPassword?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id' })
  roleId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'google_id', nullable: true, unique: true })
  googleId?: string;

  @Column({ name: 'profile_picture_url', nullable: true, type: 'text' })
  profilePictureUrl?: string;

  @Column({ name: 'fcm_token', nullable: true, type: 'text' })
  fcmToken?: string;

  constructor(partial: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
      if (partial.role && !partial.roleId) {
        this.roleId = partial.role.id;
      }
    }
  }
}
