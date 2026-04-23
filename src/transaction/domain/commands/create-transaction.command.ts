import { CreateTransactionDto } from '../dtos/create-transaction.dto';

export class CreateTransactionCommand {
  constructor(
    public readonly dto: CreateTransactionDto,
    public readonly user: { uuid: string },
  ) {}
}
