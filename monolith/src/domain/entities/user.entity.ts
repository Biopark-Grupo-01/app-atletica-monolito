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
import { Email } from '../value-objects/email.vo';
import { CPF } from '../value-objects/cpf.vo';
import { Name } from '../value-objects/name.vo';
import { Phone } from '../value-objects/phone.vo';
import { AggregateRoot } from '../aggregates/aggregate-root';
import {
  UserRegisteredEvent,
  UserRoleChangedEvent,
  UserPlanUpdatedEvent,
  UserProfileUpdatedEvent,
} from '../events/user.events';

@Entity('users')
export class User extends AggregateRoot {
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

  @Column({ name: 'firebase_uid', nullable: true, unique: true }) // Changed from google_id to firebase_uid
  firebaseUid?: string;

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

  // Domain methods for Value Objects
  setName(name: string): void {
    const nameVO = new Name(name);
    this.name = nameVO.value;
  }

  setEmail(email: string): void {
    const emailVO = new Email(email);
    this.email = emailVO.value;
  }

  setCpf(cpf: string): void {
    const cpfVO = new CPF(cpf);
    this.cpf = cpfVO.value;
  }

  setPhone(phone: string): void {
    const phoneVO = new Phone(phone);
    this.phone = phoneVO.value;
  }

  // Domain methods
  assignRole(roleId: string): void {
    const previousRoleId = this.roleId || null;
    this.roleId = roleId;

    this.addDomainEvent(
      new UserRoleChangedEvent(this.id, previousRoleId, roleId),
    );
  }

  updatePlan(startDate: Date, endDate: Date): void {
    if (endDate <= startDate) {
      throw new Error('Plan end date must be after start date');
    }
    this.planStartDate = startDate;
    this.planEndDate = endDate;

    this.addDomainEvent(new UserPlanUpdatedEvent(this.id, startDate, endDate));
  }

  isPlanActive(): boolean {
    if (!this.planStartDate || !this.planEndDate) {
      return false;
    }
    const now = new Date();
    return now >= this.planStartDate && now <= this.planEndDate;
  }

  updateProfile(name?: string, phone?: string, profilePicture?: string): void {
    const updatedFields: Record<string, any> = {};

    if (name && name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    if (name) {
      this.name = name.trim();
      updatedFields.name = name.trim();
    }
    if (phone) {
      this.phone = phone;
      updatedFields.phone = phone;
    }
    if (profilePicture) {
      this.profilePicture = profilePicture;
      updatedFields.profilePicture = profilePicture;
    }

    if (Object.keys(updatedFields).length > 0) {
      this.addDomainEvent(new UserProfileUpdatedEvent(this.id, updatedFields));
    }
  }

  // Static factory method for creating new users
  static create(
    name: string,
    email: string,
    roleId?: string,
    cpf?: string,
    phone?: string,
  ): User {
    const user = new User();

    // Set properties using Value Objects
    user.setName(name);
    user.setEmail(email);
    user.roleId = roleId;
    if (cpf) user.setCpf(cpf);
    if (phone) user.setPhone(phone);

    user.addDomainEvent(new UserRegisteredEvent(user.id, email, name, roleId));

    return user;
  }

  softDelete(): void {
    this.isDeleted = true;
  }

  restore(): void {
    this.isDeleted = false;
  }
}
