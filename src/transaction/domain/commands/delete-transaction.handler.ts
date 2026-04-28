import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTransactionCommand } from './delete-transaction.command';
import { TransactionService } from '../../service/transaction.service';
import { ActionTransactionDto } from '../dtos/action-transaction.dto';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(private readonly service: TransactionService) {}

  async execute(
    command: DeleteTransactionCommand,
  ): Promise<ActionTransactionDto> {
    await this.service.softDelete(command.uuid, command.actor);

    return { success: true };
  }
}
