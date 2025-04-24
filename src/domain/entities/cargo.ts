export class Cargo {
  constructor(
    public id: string,
    public nome: string,
    public descricao?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
