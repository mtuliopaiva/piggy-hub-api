import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { TransactionService } from '../../service/transaction.service';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(private readonly service: TransactionService) {}

  async execute(command: CreateTransactionCommand) {
    return this.service.createTransaction(command.dto, command.user);
  }
}
