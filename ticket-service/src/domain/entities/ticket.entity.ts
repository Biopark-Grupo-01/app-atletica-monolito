import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TicketStatus, TicketStatusEnum } from '../value-objects/ticket-status.vo';
import { UserTicketStatus, UserTicketStatusEnum } from '../value-objects/user-ticket-status.vo';
import { Price } from '../value-objects/price.vo';

// Re-export for external use
export { TicketStatus, TicketStatusEnum } from '../value-objects/ticket-status.vo';
export { UserTicketStatus, UserTicketStatusEnum } from '../value-objects/user-ticket-status.vo';
export { Price } from '../value-objects/price.vo';

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

  // Status do ticket em si (disponibilidade)
  @Column({ type: 'enum', enum: TicketStatusEnum, default: TicketStatusEnum.AVAILABLE })
  status: TicketStatusEnum;

  // Status relacionado ao usuário (pagamento/validade)
  @Column({ 
    type: 'enum', 
    enum: UserTicketStatusEnum, 
    default: UserTicketStatusEnum.NOT_PAID,
    nullable: true 
  })
  userStatus: UserTicketStatusEnum;

  @Column({ nullable: true })
  purchasedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date; // Data de expiração do ingresso

  @Column({ nullable: true })
  usedAt: Date; // Data em que foi usado

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
    // Se não especificado, define status padrão
    if (!this.userStatus && this.userId) {
      this.userStatus = UserTicketStatusEnum.NOT_PAID;
    }
  }

  // Value Object methods
  setPrice(amount: number, currency: string = 'BRL'): void {
    const price = new Price(amount, currency);
    this.price = price.amount;
  }

  getTicketStatus(): TicketStatus {
    return new TicketStatus(this.status);
  }

  getUserTicketStatus(): UserTicketStatus {
    return new UserTicketStatus(this.userStatus || UserTicketStatusEnum.NOT_PAID);
  }

  // Métodos de reserva (relacionados ao ticket)
  reserve(userId: string): void {
    const currentStatus = this.getTicketStatus();
    if (!currentStatus.canBeReserved()) {
      throw new Error('Ticket is not available for reservation');
    }
    this.userId = userId;
    this.status = TicketStatusEnum.RESERVED;
    this.userStatus = UserTicketStatusEnum.NOT_PAID;
    this.updatedAt = new Date();
  }

  // Métodos de pagamento (relacionados ao usuário)
  purchase(userId: string): void {
    if (!this.userId || this.userId !== userId) {
      throw new Error('Ticket is not reserved for this user');
    }
    
    const currentUserStatus = this.getUserTicketStatus();
    if (!currentUserStatus.canBePaid()) {
      throw new Error(`Cannot mark ticket as paid. Current user status: ${this.userStatus}`);
    }
    
    this.userStatus = UserTicketStatusEnum.PAID;
    this.status = TicketStatusEnum.SOLD;
    this.purchasedAt = new Date();
    this.updatedAt = new Date();
  }

  // Alias para compatibilidade
  markAsPaid(userId: string): void {
    this.purchase(userId);
  }

  // Método para usar o ingresso
  use(): void {
    const currentUserStatus = this.getUserTicketStatus();
    const currentTicketStatus = this.getTicketStatus();
    
    if (!currentUserStatus.canBeUsed()) {
      throw new Error(`Cannot use ticket. Current user status: ${this.userStatus}`);
    }
    
    if (!currentTicketStatus.canBeUsed()) {
      throw new Error(`Cannot use ticket. Current ticket status: ${this.status}`);
    }
    
    this.userStatus = UserTicketStatusEnum.USED;
    this.status = TicketStatusEnum.USED;
    this.usedAt = new Date();
    this.updatedAt = new Date();
  }

  // Método para cancelar
  cancel(): void {
    const currentUserStatus = this.getUserTicketStatus();
    if (!currentUserStatus.canBeCancelled()) {
      throw new Error(`Cannot cancel ticket. Current user status: ${this.userStatus}`);
    }
    
    this.userStatus = UserTicketStatusEnum.CANCELLED;
    this.status = TicketStatusEnum.CANCELLED;
    this.updatedAt = new Date();
  }

  // Método para reembolsar
  refund(): void {
    const currentUserStatus = this.getUserTicketStatus();
    if (!currentUserStatus.canBeRefunded()) {
      throw new Error(`Cannot refund ticket. Current user status: ${this.userStatus}`);
    }
    
    this.userStatus = UserTicketStatusEnum.REFUNDED;
    this.status = TicketStatusEnum.AVAILABLE; // Volta a ficar disponível
    this.userId = null;
    this.purchasedAt = null;
    this.usedAt = null;
    this.updatedAt = new Date();
  }

  // Método para expirar automaticamente
  expire(): void {
    const currentUserStatus = this.getUserTicketStatus();
    if (!currentUserStatus.canExpire()) {
      throw new Error(`Cannot expire ticket. Current user status: ${this.userStatus}`);
    }
    
    this.userStatus = UserTicketStatusEnum.EXPIRED;
    this.updatedAt = new Date();
  }

  // Tornar disponível novamente
  makeAvailable(): void {
    this.status = TicketStatusEnum.AVAILABLE;
    this.userStatus = null;
    this.userId = null;
    this.purchasedAt = null;
    this.usedAt = null;
    this.expiresAt = null;
    this.updatedAt = new Date();
  }

  // Verificações de preço
  isFree(): boolean {
    const price = new Price(this.price);
    return price.isFree();
  }

  // Verificações de status do ticket
  isAvailable(): boolean {
    return this.getTicketStatus().isAvailable();
  }

  isReserved(): boolean {
    return this.getTicketStatus().isReserved();
  }

  isSold(): boolean {
    return this.getTicketStatus().isSold();
  }

  // Verificações de status do usuário
  isPaid(): boolean {
    return this.getUserTicketStatus().isPaid();
  }

  isValid(): boolean {
    return this.getUserTicketStatus().isValid();
  }

  isExpired(): boolean {
    return this.getUserTicketStatus().isExpired();
  }

  isUsed(): boolean {
    return this.usedAt !== null;
  }

  // Verificar se está expirado por tempo
  isExpiredByTime(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  // Definir data de expiração
  setExpirationDate(date: Date): void {
    this.expiresAt = date;
    this.updatedAt = new Date();
  }
}
