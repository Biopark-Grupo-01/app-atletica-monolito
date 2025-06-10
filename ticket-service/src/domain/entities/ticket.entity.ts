import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TicketStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.AVAILABLE })
  status: TicketStatus;

  @Column({ nullable: true })
  purchasedAt: Date;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  
  constructor(partial: Partial<Ticket>) {
    Object.assign(this, partial);
  }

  reserve(userId: string): void {
    if (this.status !== TicketStatus.AVAILABLE) {
      throw new Error('Ticket is not available for reservation');
    }
    this.userId = userId;
    this.status = TicketStatus.RESERVED;
    this.updatedAt = new Date();
  }

  purchase(userId: string): void {
    if (this.status !== TicketStatus.AVAILABLE && this.status !== TicketStatus.RESERVED) {
      throw new Error('Ticket is not available for purchase');
    }
    this.userId = userId;
    this.status = TicketStatus.SOLD;
    this.purchasedAt = new Date();
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this.status === TicketStatus.CANCELLED) {
      throw new Error('Ticket is already cancelled');
    }
    this.status = TicketStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  makeAvailable(): void {
    this.status = TicketStatus.AVAILABLE;
    this.userId = null;
    this.purchasedAt = null;
    this.updatedAt = new Date();
  }
}