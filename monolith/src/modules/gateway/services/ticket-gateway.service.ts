import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class TicketGatewayService {
  private readonly ticketServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ticketServiceUrl =
      this.configService.get<string>('TICKET_SERVICE_URL') ||
      'http://ticket-service:3002/';
    console.log(`Ticket service URL configured as: ${this.ticketServiceUrl}`);
  }

  async proxyRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<any> {
    try {
      const url = `${this.ticketServiceUrl}/api/tickets${path}`;
      console.log(`Proxying ${method} request to: ${url}`);
      let response: AxiosResponse<any>;

      switch (method) {
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(url, { params }),
          );
          break;
        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(url, data, { params }),
          );
          break;
        case 'PUT':
          response = await firstValueFrom(
            this.httpService.put(url, data, { params }),
          );
          break;
        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(url, { params }),
          );
          break;
        default:
          throw new HttpException(
            'Method not allowed',
            HttpStatus.METHOD_NOT_ALLOWED,
          );
      }

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: { data: any; status: number };
        };
        throw new HttpException(
          (axiosError.response.data as string) || 'External service error',
          axiosError.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
