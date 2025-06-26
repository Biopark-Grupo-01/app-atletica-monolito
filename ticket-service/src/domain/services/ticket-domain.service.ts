import { Injectable } from '@nestjs/common';
import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class TicketDomainService {
  canPurchaseTicket(ticket: Ticket, userId: string): boolean {
    if (!ticket.isAvailable()) {
      return false;
    }
    
    if (ticket.userId && ticket.userId !== userId) {
      return false;
    }
    
    return true;
  }

  canCancelTicket(ticket: Ticket, userId: string): boolean {
    if (!ticket.isSold() && !ticket.isReserved()) {
      return false;
    }
    
    if (ticket.userId !== userId) {
      return false;
    }
    
    return true;
  }

  calculateRefundAmount(ticket: Ticket, cancellationDate?: Date): number {
    if (!cancellationDate) {
      cancellationDate = new Date();
    }
    
    // Simple refund policy: full refund if cancelled more than 24 hours before event
    // For now, we'll return the full price as we don't have event date in ticket
    return ticket.price;
  }

  bulkReserveTickets(tickets: Ticket[], userId: string): { 
    successful: Ticket[], 
    failed: { ticket: Ticket, reason: string }[] 
  } {
    const successful: Ticket[] = [];
    const failed: { ticket: Ticket, reason: string }[] = [];
    
    for (const ticket of tickets) {
      try {
        if (this.canPurchaseTicket(ticket, userId)) {
          ticket.reserve(userId);
          successful.push(ticket);
        } else {
          failed.push({ 
            ticket, 
            reason: 'Ticket not available for reservation' 
          });
        }
      } catch (error) {
        failed.push({ 
          ticket, 
          reason: error.message || 'Unknown error' 
        });
      }
    }
    
    return { successful, failed };
  }

  bulkPurchaseTickets(tickets: Ticket[], userId: string): { 
    successful: Ticket[], 
    failed: { ticket: Ticket, reason: string }[],
    totalAmount: number
  } {
    const successful: Ticket[] = [];
    const failed: { ticket: Ticket, reason: string }[] = [];
    let totalAmount = 0;
    
    for (const ticket of tickets) {
      try {
        if (this.canPurchaseTicket(ticket, userId)) {
          ticket.purchase(userId);
          successful.push(ticket);
          totalAmount += ticket.price;
        } else {
          failed.push({ 
            ticket, 
            reason: 'Ticket not available for purchase' 
          });
        }
      } catch (error) {
        failed.push({ 
          ticket, 
          reason: error.message || 'Unknown error' 
        });
      }
    }
    
    return { successful, failed, totalAmount };
  }

  getTicketsSummaryByEvent(tickets: Ticket[]): Map<string, {
    total: number,
    available: number,
    reserved: number,
    sold: number,
    cancelled: number,
    revenue: number
  }> {
    const summary = new Map();
    
    for (const ticket of tickets) {
      const eventId = ticket.eventId;
      
      if (!summary.has(eventId)) {
        summary.set(eventId, {
          total: 0,
          available: 0,
          reserved: 0,
          sold: 0,
          cancelled: 0,
          revenue: 0
        });
      }
      
      const eventSummary = summary.get(eventId);
      eventSummary.total++;
      
      if (ticket.isAvailable()) {
        eventSummary.available++;
      } else if (ticket.isReserved()) {
        eventSummary.reserved++;
      } else if (ticket.isSold()) {
        eventSummary.sold++;
        eventSummary.revenue += ticket.price;
      } else {
        eventSummary.cancelled++;
      }
    }
    
    return summary;
  }

  validateTicketBusinessRules(ticket: Ticket): string[] {
    const errors: string[] = [];
    
    if (!ticket.name || ticket.name.trim().length === 0) {
      errors.push('Ticket name is required');
    }
    
    if (ticket.price < 0) {
      errors.push('Ticket price cannot be negative');
    }
    
    if (!ticket.eventId) {
      errors.push('Ticket must be associated with an event');
    }
    
    return errors;
  }
}
