import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestoreTransactionCommand } from './restore-transaction.command';
import { ActionTransactionDto } from '../dtos/action-transaction.dto';
import { TransactionService } from '../../service/transaction.service';

@CommandHandler(RestoreTransactionCommand)
export class RestoreTransactionHandler implements ICommandHandler<RestoreTransactionCommand> {
  constructor(private readonly service: TransactionService) {}

  async execute(
    command: RestoreTransactionCommand,
  ): Promise<ActionTransactionDto> {
    await this.service.restore(command.uuid, command.user);

    return { success: true };
  }
}
