export interface Link {
  href: string; // URL do link
  rel: string; // Relacionamento com o recurso atual
  method: string; // Método HTTP a ser usado com este link
}

export class HateoasResponse<T> {
  data: T;
  _links: Link[];

  constructor(data: T) {
    this.data = data;
    this._links = [];
  }

  addLink(href: string, rel: string, method: string): this {
    this._links.push({ href, rel, method });
    return this;
  }
}
