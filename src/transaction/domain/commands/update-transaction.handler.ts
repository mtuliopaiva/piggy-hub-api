import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from './update-transaction.command';
import { ReadTransactionDto } from '../dtos/read-transaction.dto';
import { TransactionService } from '../../service/transaction.service';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(private readonly service: TransactionService) {}

  async execute(
    command: UpdateTransactionCommand,
  ): Promise<ReadTransactionDto> {
    const updatedTransaction = await this.service.updateTransaction(
      command.uuid,
      command.dto,
      command.user,
    );

    return {
      uuid: updatedTransaction.uuid,
      title: updatedTransaction.title,
      amount: updatedTransaction.amount,
      type: updatedTransaction.type,
      date: updatedTransaction.date,
      category: updatedTransaction.category.name,
      categoryUuid: updatedTransaction.categoryUuid,
      userUuid: updatedTransaction.userUuid,
      createdAt: updatedTransaction.createdAt,
      updatedAt: updatedTransaction.updatedAt,
      deletedAt: updatedTransaction.deletedAt ?? null,
    };
  }
}
