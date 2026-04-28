import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionByCurrentUserQuery } from './transaction-by-currentUser.query';
import { TransactionService } from '../../service/transaction.service';
import { ReadTransactionDto } from '../dtos/read-transaction.dto';

@QueryHandler(TransactionByCurrentUserQuery)
export class TransactionByCurrentUserHandler implements IQueryHandler<TransactionByCurrentUserQuery> {
  constructor(private readonly service: TransactionService) {}

  async execute(query: TransactionByCurrentUserQuery): Promise<{
    data: ReadTransactionDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list({
      userUuid: query.data.userUuid,
    });

    return {
      data: data.map(
        (transaction): ReadTransactionDto => ({
          uuid: transaction.uuid,
          title: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date,
          userUuid: transaction.userUuid,
          categoryUuid: transaction.categoryUuid,
          category: transaction.category.name,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          deletedAt: transaction.deletedAt,
        }),
      ),
      meta: { total },
    };
  }
}
