// news.dto.ts
export class CreateNewsDto {
  image: string;
  title: string;
  date: Date;
  location: string;
  description: string;
}

export class UpdateNewsDto {
  image?: string; // Opcional, pois pode não ser atualizado
  title?: string;
  date?: Date;
  location?: string;
  description?: string;
}