import { ApiProperty } from '@nestjs/swagger';

export class HateoasLinkDto {
  @ApiProperty({
    example: 'self',
    description: 'The relation of the link to the current resource.',
  })
  rel: string;

  @ApiProperty({
    example: '/api/tickets/123',
    description: 'The URI of the linked resource.',
  })
  href: string;

  @ApiProperty({
    example: 'GET',
    description: 'The HTTP method to be used for the link.',
  })
  method: string;
}
