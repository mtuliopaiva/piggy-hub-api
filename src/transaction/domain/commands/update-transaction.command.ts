import { UpdateTransactionDto } from '../dtos/update-transaction.dto';

export class UpdateTransactionCommand {
  constructor(
    public readonly uuid: string,
    public readonly dto: UpdateTransactionDto,
  ) {}
}
