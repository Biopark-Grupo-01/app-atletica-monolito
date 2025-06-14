import { Injectable } from '@nestjs/common';
import { HateoasLinkDto } from 'src/interfaces/http/hateoas-link.dto';

@Injectable()
export class HateoasService {
  createSelfLink(url: string, method: string): HateoasLinkDto {
    return { rel: 'self', href: url, method };
  }

  createLinksForItem(
    basePath: string,
    itemId: string,
    includeUpdate = true,
    includeDelete = true,
  ): HateoasLinkDto[] {
    const links: HateoasLinkDto[] = [
      this.createSelfLink(`${basePath}/${itemId}`, 'GET'),
    ];

    if (includeUpdate) {
      links.push({
        rel: 'update',
        href: `${basePath}/${itemId}`,
        method: 'PUT',
      });
    }

    if (includeDelete) {
      links.push({
        rel: 'delete',
        href: `${basePath}/${itemId}`,
        method: 'DELETE',
      });
    }
    links.push({ rel: 'collection', href: basePath, method: 'GET' });
    return links;
  }

  createLinksForCollection(
    basePath: string,
    // TODO: Add pagination parameters if needed in the future
  ): HateoasLinkDto[] {
    return [
      this.createSelfLink(basePath, 'GET'),
      { rel: 'create', href: basePath, method: 'POST' },
    ];
  }

  addLinksToItem<T extends { id: string }>(
    item: T,
    basePath: string,
  ): T & { _links?: HateoasLinkDto[] } {
    return {
      ...item,
      _links: this.createLinksForItem(basePath, item.id),
    };
  }

  addLinksToCollection<T extends { id: string }>(
    items: T[],
    basePath: string,
  ): Array<T & { _links?: HateoasLinkDto[] }> {
    return items.map((item) => this.addLinksToItem(item, basePath));
  }
}
