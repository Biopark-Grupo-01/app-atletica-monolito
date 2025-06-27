import { Injectable } from '@nestjs/common';
import { HateoasLinkDto } from '../dtos/hateoas-link.dto';

@Injectable()
export class HateoasService {
  createSelfLink(url: string, method: string): HateoasLinkDto {
    return { rel: 'self', href: url, method };
  }

  createLinksForTicket(ticketId: string): HateoasLinkDto[] {
    const basePath = '/api/tickets';
    const links: HateoasLinkDto[] = [
      this.createSelfLink(`${basePath}/${ticketId}`, 'GET'),
      { rel: 'update', href: `${basePath}/${ticketId}`, method: 'PUT' },
      { rel: 'delete', href: `${basePath}/${ticketId}`, method: 'DELETE' },
      { rel: 'collection', href: basePath, method: 'GET' },
    ];

    // Adicionar links específicos para ações de ticket
    links.push(
      { rel: 'reserve', href: `${basePath}/${ticketId}/reserve/{userId}`, method: 'POST' },
      { rel: 'purchase', href: `${basePath}/${ticketId}/purchase/{userId}`, method: 'POST' },
      { rel: 'cancel', href: `${basePath}/${ticketId}/cancel`, method: 'POST' },
      { rel: 'use', href: `${basePath}/${ticketId}/use`, method: 'POST' }
    );

    return links;
  }

  createLinksForCollection(): HateoasLinkDto[] {
    const basePath = '/api/tickets';
    return [
      this.createSelfLink(basePath, 'GET'),
      { rel: 'create', href: basePath, method: 'POST' },
      { rel: 'find-by-event', href: `${basePath}/event/{eventId}`, method: 'GET' },
      { rel: 'find-by-user', href: `${basePath}/user/{userId}`, method: 'GET' },
      { rel: 'find-available-by-event', href: `${basePath}/event/{eventId}/available`, method: 'GET' }
    ];
  }

  addLinksToTicket<T extends { id: string }>(
    ticket: T,
  ): T & { _links?: HateoasLinkDto[] } {
    return {
      ...ticket,
      _links: this.createLinksForTicket(ticket.id),
    };
  }

  addLinksToCollection<T extends { id: string }>(
    tickets: T[],
  ): Array<T & { _links?: HateoasLinkDto[] }> {
    return tickets.map((ticket) => this.addLinksToTicket(ticket));
  }

  createCollectionResponse<T extends { id: string }>(
    tickets: T[],
  ): { 
    data: Array<T & { _links?: HateoasLinkDto[] }>;
    _links: HateoasLinkDto[];
  } {
    return {
      data: this.addLinksToCollection(tickets),
      _links: this.createLinksForCollection()
    };
  }
}
